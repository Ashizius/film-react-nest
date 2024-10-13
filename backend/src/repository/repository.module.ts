import { Module } from '@nestjs/common';
import { FilmsRepository } from './films.repository';
import { Repository } from './repository';
import { configProvider } from '../app.config.provider';

@Module({
  providers: [configProvider, FilmsRepository, Repository],
  exports: [Repository],
})
export class RepositoryModule {}
