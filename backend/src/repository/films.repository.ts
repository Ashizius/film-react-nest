import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import mongoose from 'mongoose';
import { AppConfig } from '../app.config.provider';
import { ITicket } from '../order/dto/order.dto';

export interface ISchedule {
  id: string;
  daytime: string;
  hall: string;
  rows: number;
  seats: number;
  price: number;
  taken: string[];
}

interface IDbSchedule extends ISchedule {
  _id: mongoose.Types.ObjectId;
}

export interface IFilm {
  id: string;
  rating: number;
  director: string;
  tags: string[];
  image: string;
  cover: string;
  title: string;
  about: string;
  description: string;
  schedule: ISchedule[];
}

interface IDbFilm extends Omit<IFilm, 'schedule'> {
  _id: mongoose.Types.ObjectId;
  schedule: IDbSchedule[];
}

interface IDbOrdered extends IDbFilm {
  takenRow: string;
  takenSeat: string;
}

export type FilmDocument = mongoose.Document<unknown, {}, IDbFilm> &
  IDbFilm &
  Required<{
    _id: mongoose.Types.ObjectId;
  }>;

export type ScheduleDocument = mongoose.Document<unknown, {}, IDbSchedule> &
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

//export default Film;

@Injectable()
export class FilmsRepository {
  //private films: IFilm[] = [];
  private getScheduleMapperFn(schedule: IDbSchedule): ISchedule {
    //console.log(schedule);
    const { _id, ...other } = schedule;
    return {
      ...other,
    };
  }

  private getFilmMapperFn(film: FilmDocument): IFilm {
    const { _id, schedule: dbSchedule, ...filmData } = film.toObject();
    //console.log(this);
    const schedule = dbSchedule.map(this.getScheduleMapperFn);

    return {
      //            id: String(_id),
      ...filmData,
      schedule,
    };
  }
  /*private getFilmMapperFn(film: FilmDocument) {
    return film;
  }*/
  async findAll(): Promise<[number, IFilm[]]> {
    const films = await filmModel.find({}); //используем обычные методы Mongoose-документов
    const total = await filmModel.countDocuments({});
    //console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
    //console.log(items);
    //console.log(this);
    return [total, films.map(this.getFilmMapperFn.bind(this))];
  }

  async findOne(id: string): Promise<IFilm> {
    let film: FilmDocument | null;
    try {
      film = await filmModel.findOne({ id });
    } catch (error) {
      if (error.message) {
        const isNotFound = error.message.indexOf('not found') > 0;
        const isCastError =
          error.message.indexOf('Cast to ObjectId failed') > 0;
        if (isNotFound || isCastError) {
          throw new NotFoundException(
            'запись не найдена или передан некорректный id',
          );
        }
        throw error;
      }
    }
    if (!film) {
      return null;
    }
    const { _id, schedule: dbSchedule, ...filmData } = film.toObject();
    return {
      ...filmData,
      schedule: dbSchedule.map(this.getScheduleMapperFn.bind(this)),
    };
  }

  private ticketQuiery(ticket: ITicket) {
    const { session } = ticket;
    return [
      { 'schedule.id': session },
      { schedule: { $elemMatch: { id: session } }, id: 1, title: 1 },
    ];
  }
  /*
db.objects.updateOne({
  ["items.id"]: 2
}, {
  $set: {
    "items.$.blocks.$[block].txt": "hi",
  },
}, {
  arrayFilters: [{
    "block.id": 3,
  }],
});
db.objects.update({'items.blocks.id': id_here}, {'$set': {'items.$[].blocks.$.txt': 'hi'}})
*/
  // https://www.mongodb.com/docs/manual/reference/operator/update/positional-all/

  /* https://www.mongodb.com/docs/manual/reference/operator/update/positional/
.updateOne(
   { id: film, "schedule.id": session },
   { $push: { "schedule.$.taken" : 'aaa' } }
)
*/

  private async findFreeSeats(tickets: ITicket[]) {
    return filmModel.aggregate([
      { $match: { $or: tickets.map((ticket) => ({ id: ticket.film })) } },
      { $unwind: '$schedule' },
      {
        $match: {
          $or: tickets.map(({ session, row, seat }) => ({
            $and: [
              { 'schedule.id': session },
              { 'schedule.taken': {$not: { $elemMatch: { $eq: `${row}:${seat}` } } }},
              //{$elemMatch: {'schedule.taken':'4:5' }}
              //{ 'schedule.price': ticket.price },
              //{  $elemMatch: {'schedule.taken':'4:5' } },
            ],
          })),
        },
      },
      //{ $count: 'seats are taken' },
    ]);
  }

  private async bookTicket({ film, session, row, seat }: ITicket) {
    const findQuery = { id: film, 'schedule.id': session };
    const updateQuery = { $push: { 'schedule.$.taken': `${row}:${seat}` } };
    const options = { new: true ,
      projection: {
        takenRow: `${row}`,
        takenSeat: `${seat}`,
        title:1,
        id:1,
        'schedule':{$elemMatch:{id:session}},

        //'schedule.$':1,

      }
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
    return bookedTicket.toObject()
  }

  async takeSeats(tickets: ITicket[]) {
    let orders: IDbOrdered[];
    /*const freeSeats = await this.findFreeSeats(tickets);
    if (takenSeats.length!==tickets.length) {
      return Promise.reject({
        message: 'не найден сеанс или место уже занято',
      });
    }*/
    try {
      orders = await Promise.all(tickets.map(this.bookTicket.bind(this)));
    } catch (error) {
      console.log(error);
      throw error;
    }
    return orders;
  }

  /*
  private ticketQuery(ticket: ITicket) {
    const { film: filmId, session: sessionId, price, row, seat } = ticket;
    return {
      $and: [
        { id: filmId },
        {
          schedule: {
            $elemMatch: {
              id: sessionId,
              price,
              taken: { $elemMatch: { $eq: '4:5' } },
            },
          },
        },
      ],
    };
  }*/
  /*return {
      $and: [
        { id: filmId },
        {
          $or: [
            {
              schedule: {
                $elemMatch: {
                  id: sessionId,
                  taken: { $elemMatch: { $eq: `${row}:${seat}` } },
                },
              },
            },
            {
              schedule: {
                $elemMatch: {
                  id: sessionId,
                  taken: { $size: 0 },
                },
              },
            },
          ],
        },
      ],
    };*/

  /*
            $and: [
              { 'schedule.id': '5beec101-acbb-4158-adc6-d855716b44a8' },
              { 'schedule.taken': {$not: {$elemMatch:'4:5'}} },
            ],
*/
  /*const orderCursor = filmModel
        .find(
          { id: tickets.map((ticket) => ticket.film) },
          {
            //'schedule':{$elemMatch:{id:'f2e429b0-685d-41f8-a8cd-1d8cb63b99ce',"taken": {$elemMatch:{$ne:'4:5'}}}},
            //schedule:{$elemMatch: { "id": tickets.map((ticket) => ticket.session) }},
            //schedule:{$elemMatch: { "id": {$in: ['7f59de0d-62b2-412f-9e0b-bf6e971c44e5','f2e429b0-685d-41f8-a8cd-1d8cb63b99ce','5beec101-acbb-4158-adc6-d855716b44a8']} }},
            schedule:{$all: { "price": 350}},
            id:1,
            //schedule: {$or: tickets.map((ticket) => ({ id: ticket.session }))},
            title: 1,
          },
        );*/
  //total = await orderCursor.countDocuments();
  //console.log(total);

  //{ $not: `${row}:${seat}` }
  /*async takeSeats(tickets: ITicket[]) {*/
  //  try {
  /* const orderCursor = filmModel
      .aggregate([
        { $match: { $or: tickets.map((ticket) => ({ id: ticket.film })) } },
        { $unwind: '$schedule' },
        {
          $match: {
            $or: tickets.map(({ session, row, seat }) => ({
              $and: [
                { 'schedule.id': session },
                {
                  'schedule.taken': {
                    $not: { $elemMatch: { $eq: `${row}:${seat}` } },
                  },
                },
                //{ 'schedule.price': ticket.price },
                //{  $elemMatch: {'schedule.taken':'4:5' } },
              ],
            })),
          },
        },
      ])
      .cursor();*/
  /*
    let order: FilmDocument[] | null;
    try {
      order = await filmModel.find(orderCursor);
    } catch (error) {}

    return order;
*/
  /*order = await filmModel.find(
        { id: tickets.map((ticket) => ticket.film) },
        {
          schedule:{$elemMatch: { "id": tickets.map((ticket) => ticket.session) }},
          "title":1
        },
      );*/
  /*
      order = await filmModel.find({
        $or: tickets.map(this.ticketQuery.bind(this)),
      });*/
  //  } catch (error) {}
  /*if (order.length === tickets.length) {
      order.forEach((item) => {
        item.updateOne()
      });
    } else {
      throw new Error('проверьте заказ');
    }*/

  //console.log(order);

  /* }*/
}
