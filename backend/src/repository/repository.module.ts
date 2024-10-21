import { Module } from '@nestjs/common';
import { FilmsRepository } from './mongo/films.repository';
import { RepositoryProvider } from './repository.provider';
import { ConfigProvider } from '../app.config.provider';
import { databaseProvider } from './database.provider';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Films } from './postgres/films.enity';
import { Schedules } from './postgres/schedules.entity';


@Module({
  imports: [
    TypeOrmModule.forFeature([Films, Schedules]),
  ],
  providers: [ConfigProvider, FilmsRepository, RepositoryProvider, databaseProvider],
  exports: [RepositoryProvider],
})
export class RepositoryModule {}

/*

import { Module, DynamicModule } from '@nestjs/common';
import { MongoDBService } from './mongodb.service';
import { PostgreSQL } from './postgresql.service';

export enum DBMS {
  MongoDB,
  PostgreSQL,
}

@Module({})
export class DatabaseModule {
  static register(dbms: DBMS): DynamicModule {
    const providers = [];

    switch (dbms) {
      case DBMS.MongoDB:
        providers.push(MongoDBService);
        break;

      case DBMS.PostgreSQL:
      default:
        providers.push(PostgreSQLService);
        break;
    }

    return {
      module: DatabaseModule,
      providers,
      exports: providers,
    }
  }
}

*/
/*
import { DynamicModule, Inject, Module } from '@nestjs/common';
import { FilmsRepository } from './mongo/films.repository';
import { RepositoryProvider } from './repository';
import { AppConfig, ConfigProvider } from '../app.config.provider';
import { databaseProvider } from './database.provider';

@Module({})
export class RepositoryModule {
  static register(): DynamicModule {
    const providers= [configProvider, FilmsRepository, RepositoryProvider, databaseProvider];
    return {
      module: RepositoryModule,
      providers: [configProvider, FilmsRepository, RepositoryProvider, databaseProvider],
      exports: [RepositoryProvider],
    }
  }
}
*/
