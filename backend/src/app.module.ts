import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule } from '@nestjs/config';
import * as path from 'node:path';

import { FilmsController } from './films/films.controller';
import { OrderController } from './order/order.controller';
import { FilmsService } from './films/films.service';
import { RepositoryModule } from './repository/repository.module';
import { OrderService } from './order/order.service';
import configuration, { AppConfigDatabase } from './configuration';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Films } from './repository/entities/films.enity';
import { Schedules } from './repository/entities/schedules.entity';
import { LoggerModule } from './logger/logger.module';
import { DevLogger } from './logger/dev.logger';
import { JsonLogger } from './logger/json.logger';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [configuration],
    }),
    ServeStaticModule.forRoot({
      // раздача статических файлов из public
      rootPath: path.join(__dirname, '..', 'public'),
      serveStaticOptions: {
        //кеширование
        maxAge: 10 * 1000, // милисекунды
      },
    }),
    RepositoryModule,
    // Configure TypeOrmModule to access DatabaseModule using an async factory function
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const { type, host, port, database, credentials } =
          configService.get<AppConfigDatabase>('database');
        const { username, password } = credentials;
        return {
          type,
          host,
          port,
          username,
          password,
          database,
          entities: [Films, Schedules],
          synchronize: false,
        };
      },
    }),
    LoggerModule
  ],
  controllers: [FilmsController, OrderController],
  providers: [FilmsService, OrderService, DevLogger, JsonLogger],
})
export class AppModule {}
