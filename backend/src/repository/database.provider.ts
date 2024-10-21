import { AppConfig } from '../app.config.provider';
import mongoose, { Mongoose } from 'mongoose';

async function connectToMongoose(url:string): Promise<Mongoose> {
  /*try {
    return mongoose.connect(url);
  } catch (error) {
    console.error('Error connecting to the database', error);
  }*/
    return mongoose.connect(url);
}

export type DBConnection = Promise<Mongoose>;

export const databaseProvider = {
  provide: 'DATA_SOURCE',
  useFactory: async (config: AppConfig):DBConnection => {
    console.log(config.database.url);
    return connectToMongoose(config.database.url);
  },
  inject: ['CONFIG'],
};
