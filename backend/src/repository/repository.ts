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
    this.connectToDatabase(); // подключаемся к серверу MongoDB
  }

  private async connectToDatabase() {
    try {
      await mongoose.connect(this.config.database.url);
      console.log('Successfully connected to the database');
    } catch (error) {
      console.error('Error connecting to the database', error);
    }
  }
}
