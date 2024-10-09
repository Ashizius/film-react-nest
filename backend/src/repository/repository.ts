import { Inject, Injectable } from '@nestjs/common';
import { AppConfig } from '../app.config.provider';
import { FilmsRepository } from './films.repository';
import mongoose from 'mongoose';

@Injectable()
export class Repository {
  constructor(
    @Inject('CONFIG') private readonly config: AppConfig,
    public readonly filmsRepository: FilmsRepository,
  ) {
    console.log(config.database.url);

    /*const { PORT = 3000, DB_ADDRESS = 'mongodb://127.0.0.1:27017/weblarek' } =
      process.env;*/

    mongoose.connect(config.database.url); // подключаемся к серверу MongoDB
    const db = mongoose.connection;
  }
}
