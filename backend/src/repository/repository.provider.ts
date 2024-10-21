import { Inject, Injectable } from '@nestjs/common';
import { AppConfig } from '../app.config.provider';
import { DataSource, Like, Repository } from 'typeorm';

import { IFilm } from '../films/dto/films.dto';
import { IBookResult, ITicket } from '../order/dto/order.dto';
import { Mongoose } from 'mongoose';
import { InjectRepository } from '@nestjs/typeorm';
import { Films } from './entities/films.enity';
import { Schedules } from './entities/schedules.entity';
import { In } from 'typeorm';
import { faker } from '@faker-js/faker';
import { error } from 'console';

export interface IFilmRepository {
  findAll(): Promise<[number, IFilm[]]>;
  findOne(id: string): Promise<IFilm>;
  takeSeats(tickets: ITicket[]): Promise<IBookResult[]>;
}

@Injectable()
export class RepositoryProvider {
  public readonly films: IFilmRepository;
  constructor(
    @InjectRepository(Films)
    private filmsRepository: Repository<Films>,
    @InjectRepository(Schedules)
    private schedulesRepository: Repository<Schedules>,
    private dataSource: DataSource,
  ) {}
  async getFilms(): Promise<[number, IFilm[]]> {
    const films = await this.filmsRepository.find({
      order: {
        title: 'ASC',
      },
    });
    return [films.length, films];
  }
  async getSchedule(id: string): Promise<IFilm> {
    const film = await this.filmsRepository.findOne({
      where: { id },
      relations: {
        schedule: true,
      },
      order: {
        schedule: {
          daytime: 'ASC',
        },
      },
    });
    return film;
  }

  private IsTakenSeatQueryMapper(ticket: ITicket) {
    const { seat, row, session } = ticket;
    return {
      id: session,
      taken: Like(`%${row}:${seat}%`),
    };
  }

  private async takeSeatQueryMapper(ticket: ITicket) {
    const { seat, row, session } = ticket;
    return this.dataSource
      .createQueryBuilder()
      .update(Schedules)
      .set({
        taken: () => `CONCAT(taken, ',${row}:${seat}')`,
      })
      .where('id = :id', { id: session })
      .execute();
  }

  async orderSeats(tickets: ITicket[]): Promise<IBookResult[]> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const takenSeats = await this.schedulesRepository.count({
        where: tickets.map(this.IsTakenSeatQueryMapper.bind(this)),
      });
      if (takenSeats > 0) {
        throw new Error('не найдено свободного места');
      }
      await Promise.all(tickets.map(this.takeSeatQueryMapper.bind(this)));

      const orders = await this.schedulesRepository.find({
        where: tickets.map(this.IsTakenSeatQueryMapper.bind(this)),
      });
      await queryRunner.commitTransaction();

      return tickets.map((ticket) => {
        const { id, filmId, ...order } = orders.find(
          (order) => order.id === ticket.session,
        );
        delete order.seats;
        delete order.rows;
        delete order.taken;
        delete order.film;
        return {
          id: faker.string.uuid(),
          ...order,
          film: filmId,
          session: id,
          seat: ticket.seat,
          row: ticket.row,
        };
      });
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}
