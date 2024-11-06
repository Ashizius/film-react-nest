import { Injectable } from '@nestjs/common';
import { DataSource, Like, Repository } from 'typeorm';

import { IFilm } from '../films/dto/films.dto';
import { IBookResult, ITicket } from '../order/dto/order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Films } from './entities/films.enity';
import { Schedules } from './entities/schedules.entity';
import { faker } from '@faker-js/faker';

export interface IFilmRepository {
  findAll(): Promise<[number, IFilm[]]>;
  findOne(id: string): Promise<IFilm>;
  takeSeats(tickets: ITicket[]): Promise<IBookResult[]>;
}

@Injectable()
export class RepositoryProvider {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Films)
    private filmsRepository: Repository<Films>,
    @InjectRepository(Schedules)
    private schedulesRepository: Repository<Schedules>,
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

      const newSchedule = await this.schedulesRepository.find({
        where: tickets.map(this.IsTakenSeatQueryMapper.bind(this)),
      });

      const orderResult = tickets.map(({ row, seat, session }) => {
        const { id, filmId, ...schedule } = newSchedule.find(
          (schedule) => schedule.id === session,
        );
        if (
          schedule.taken.filter((takenOne) => takenOne === `${row}:${seat}`)
            .length !== 1
        ) {
          throw new Error('не найдено свободного места');
        }
        delete schedule.seats;
        delete schedule.rows;
        delete schedule.taken;
        delete schedule.film;
        return {
          id: faker.string.uuid(),
          ...schedule,
          film: filmId,
          session: id,
          seat: seat,
          row: row,
        };
      });
      await queryRunner.commitTransaction();
      return orderResult;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}
