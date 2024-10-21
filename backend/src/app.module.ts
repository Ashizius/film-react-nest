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
import { ConfigService } from '@nestjs/config';
import { Films } from './repository/entities/films.enity';
import { Schedules } from './repository/entities/schedules.entity';

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
      // Import the AppConfigModule
      //imports: [AppConfigModule],
      // Inject ConfigService to dynamically retrieve configuration
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const dbType = configService.get<'postgres'>(
          'DATABASE_DRIVER',
          'postgres',
        );
        return {
          type: dbType, //Тип драйвера Postgres
          host: configService.get('DATABASE_HOST', 'localhost'), //Адрес сервера базы данных
          port: configService.get('DATABASE_PORT', 5432), //Postgres порт
          username: configService.get('DATABASE_USERNAME', 'prac'), //Логин и пароль пользователя,
          password: configService.get('DATABASE_PASSWORD', 'prac'), //  для доступа к БД.
          database: configService.get('DATABASE_DATABASE', 'prac'), //Имя базы данных
          entities: [Films, Schedules], //сущности, которые описывают нашу базу данных
          synchronize: false,
        };
      },
    }),
  ],
  controllers: [FilmsController, OrderController],
  providers: [ConfigProvider, FilmsService, OrderService],
})
export class AppModule {}
