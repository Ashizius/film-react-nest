import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule } from '@nestjs/config';
import * as path from 'node:path';

import { ConfigProvider } from './app.config.provider';
import { FilmsController } from './films/films.controller';
import { OrderController } from './order/order.controller';
import { FilmsService } from './films/films.service';
import { RepositoryModule } from './repository/repository.module';
import { OrderService } from './order/order.service';
import configuration from './configuration';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfig } from './app.config.provider';
import { ConfigService } from '@nestjs/config';
import { Films } from './repository/postgres/films.enity';
import { Schedules } from './repository/postgres/schedules.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [configuration]
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
          // Import the AppConfigModule
          //imports: [AppConfigModule],
          // Inject ConfigService to dynamically retrieve configuration
          inject: [ConfigService],
          useFactory: async (configService: ConfigService) => ({
            type: 'postgres',//configService.get<'postgres'|'mongodb'>("DATABASE_DRIVER",'postgres'), //Тип драйвера Postgres
            host: 'localhost', //Адрес сервера базы данных
            port: configService.get("DATABASE_PORT", 5432), //Postgres порт
            username: 'prac', //Логин и пароль пользователя,
            password: 'prac', //  для доступа к БД.
            database: 'prac', //Имя базы данных
            entities: [Films, Schedules], //сущности, которые описывают нашу базу данных
            synchronize: false, //означает, что при старте приложение будет подгонять базу в СУБД к той, что описана в ORM. Удобно для
          }),
        }),
  ],
  controllers: [FilmsController, OrderController],
  providers: [ConfigProvider, FilmsService, OrderService],
})
export class AppModule {}
