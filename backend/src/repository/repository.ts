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
    mongoose.connect(this.config.database.url); // подключаемся к серверу MongoDB
  }
}
