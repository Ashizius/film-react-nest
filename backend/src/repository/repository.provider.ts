import { Inject, Injectable } from '@nestjs/common';
import { AppConfig } from '../app.config.provider';
import { FilmsRepository } from './mongo/films.repository';
import { DataSource, Like, Repository } from 'typeorm';

import { IFilm } from '../films/dto/films.dto';
import { IBookResult, ITicket } from '../order/dto/order.dto';
import { DBConnection } from './database.provider';
import { Mongoose } from 'mongoose';
import { InjectRepository } from '@nestjs/typeorm';
import { Films } from './postgres/films.enity';
import { Schedules } from './postgres/schedules.entity';
import { In } from 'typeorm';
import { faker } from '@faker-js/faker';

export interface IFilmRepository {
  findAll(): Promise<[number, IFilm[]]>;
  findOne(id: string): Promise<IFilm>;
  takeSeats(tickets: ITicket[]): Promise<IBookResult[]>;
}

@Injectable()
export class RepositoryProvider {
  public readonly films: IFilmRepository;
  constructor(
    @Inject('CONFIG') private readonly config: AppConfig,
    @Inject(FilmsRepository) public readonly filmsRepository: FilmsRepository,
    @Inject('DATA_SOURCE') private readonly connection: DBConnection, // подключаемся к серверу MongoDB
    @InjectRepository(Films)
    private filmsRepo: Repository<Films>,
    @InjectRepository(Schedules)
    private schedulesRepository: Repository<Schedules>,
    private dataSource: DataSource,
  ) {
    /*filmsRepo
      .find(/*{
        where: { id: '0e33c7f6-27a7-4aa0-8e61-65d7e5effecf' },
        relations: {
          schedule: true,
        },
      })
      .then((item) => console.log('item!!!!!', item /*[0].schedule[0]));*/
    if (connection instanceof Mongoose) {
      this.films = filmsRepository;
    } else {
      throw new Error('DB is not defined!');
    }
    //console.log(this.connection);
  }
  async getFilms(): Promise<[number, IFilm[]]> {
    const films = await this.filmsRepo.find({
      order: {
        title: 'ASC',
      },
    });
    return [films.length, films];
  }
  async getSchedule(id: string): Promise<IFilm> {
    const film = await this.filmsRepo.findOne({
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
    //console.log(film);
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
    /*this.schedulesRepository.update(
      { id: session },
      { taken: {append:`%${row}:${seat}%`} },
    );*/
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
        await queryRunner.rollbackTransaction();
        return [];
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
      console.log('!!!!!!!!!!!!!!!!!ERROR');
      console.error(err);
      return [];
    } finally {
      await queryRunner.release();
    }
  }
}
