import { Injectable } from '@nestjs/common';
import mongoose from 'mongoose';
import { faker } from '@faker-js/faker';
import { ITicket } from '../../order/dto/order.dto';
import { IFilm, ISchedule } from '../../films/dto/films.dto';
import { IFilmRepository } from '../repository.provider';

interface IDbSchedule extends ISchedule {
  _id: mongoose.Types.ObjectId;
}

interface IDbFilm extends Omit<IFilm, 'schedule'> {
  _id: mongoose.Types.ObjectId;
  schedule: IDbSchedule[];
}

interface IDbOrdered extends IDbFilm {
  takenRow: string;
  takenSeat: string;
}

export type FilmDocument = mongoose.Document<unknown, object, IDbFilm> &
  IDbFilm &
  Required<{
    _id: mongoose.Types.ObjectId;
  }>;

export type ScheduleDocument = mongoose.Document<unknown, object, IDbSchedule> &
  IDbSchedule &
  Required<{
    _id: mongoose.Schema.Types.ObjectId;
  }>;

const ScheduleSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  daytime: { type: Date, required: true },
  hall: { type: String, required: true },
  rows: { type: Number, required: true },
  seats: { type: Number, required: true },
  price: { type: Number, required: true },
  taken: { type: [String], required: true },
});

const FilmSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  rating: { type: Number, required: true },
  director: { type: String, required: true },
  tags: { type: [String], required: true },
  image: { type: String, required: true },
  cover: { type: String, required: true },
  title: { type: String, required: true },
  about: { type: String, required: true },
  description: { type: String, required: true },
  schedule: { type: [ScheduleSchema], required: true },
});

const filmModel = mongoose.model<IDbFilm>('Film', FilmSchema);

@Injectable()
export class FilmsRepository implements IFilmRepository {
  private getScheduleMapperFn(schedule: IDbSchedule): ISchedule {
    delete schedule['_id'];
    return schedule;
  }

  private getFilmMapperFn(film: FilmDocument): IFilm {
    const { schedule: dbSchedule, ...filmData } = film.toObject();
    const schedule = dbSchedule.map(this.getScheduleMapperFn);
    delete filmData['_id'];
    return {
      ...filmData,
      schedule,
    };
  }

  async findAll(): Promise<[number, IFilm[]]> {
    const films = await filmModel.find({}); //используем обычные методы Mongoose-документов
    const total = await filmModel.countDocuments({});
    return [total, films.map(this.getFilmMapperFn.bind(this))];
  }

  async findOne(id: string): Promise<IFilm> {
    const film: FilmDocument | null = await filmModel.findOne({ id });

    if (!film) {
      return null;
    }
    return this.getFilmMapperFn.call(this, film);
  }

  private async findTakenSeats(tickets: ITicket[]) {
    return filmModel.aggregate([
      { $match: { $or: tickets.map((ticket) => ({ id: ticket.film })) } },
      { $unwind: '$schedule' },
      {
        $match: {
          $or: tickets.map(({ session, row, seat }) => ({
            $and: [
              { 'schedule.id': session },
              {
                'schedule.taken': {
                  $elemMatch: { $eq: `${row}:${seat}` },
                },
              },
            ],
          })),
        },
      },
    ]);
  }

  private async bookTicket({ film, session, row, seat }: ITicket) {
    const findQuery = { id: film, 'schedule.id': session };
    const updateQuery = { $push: { 'schedule.$.taken': `${row}:${seat}` } };
    const options = {
      new: true,
      projection: {
        takenRow: `${row}`,
        takenSeat: `${seat}`,
        title: 1,
        id: 1,
        schedule: { $elemMatch: { id: session } },
      },
    };

    const bookedTicket = await filmModel.findOneAndUpdate(
      findQuery,
      updateQuery,
      options,
    );
    if (!bookedTicket) {
      console.log(`${session}`);
      return Promise.reject({
        message: 'не найден сеанс',
      });
    }
    return bookedTicket.toObject();
  }

  async takeSeats(tickets: ITicket[]) {
    //ищем занятые места
    const takenSeats = await this.findTakenSeats(tickets);
    console.log(takenSeats);
    if (takenSeats.length > 0) {
      throw new Error('не найдено свободного места');
    }
    // помещаем бронирование мест в поддокументы с сеансами
    const orders: IDbOrdered[] = await Promise.all(
      tickets.map(this.bookTicket.bind(this)),
    );
    return orders.map((document) => {
      const session = document.schedule[0];
      return {
        film: document.id,
        session: session.id,
        daytime: session.daytime,
        row: Number(document.takenRow),
        seat: Number(document.takenSeat),
        price: session.price,
        id: faker.string.uuid(),
      };
    });
  }
}
