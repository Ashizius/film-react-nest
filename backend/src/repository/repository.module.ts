import { Module } from '@nestjs/common';
import { RepositoryProvider } from './repository.provider';
import { ConfigProvider } from '../app.config.provider';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Films } from './entities/films.enity';
import { Schedules } from './entities/schedules.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Films, Schedules])],
  providers: [ConfigProvider, RepositoryProvider],
  exports: [RepositoryProvider],
})
export class RepositoryModule {}
