import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule } from '@nestjs/config';
import * as path from 'node:path';

import { configProvider } from './app.config.provider';
import { FilmsController } from './films/films.controller';
import { OrderController } from './order/order.controller';
import { FilmsRepository } from './repository/films.repository';
import { FilmsService } from './films/films.service';
import { Repository } from './repository/repository';
import { RepositoryModule } from './repository/repository.module';
import { OrderService } from './order/order.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
    }),
    ServeStaticModule.forRoot({
      // раздача статических файлов из public
      rootPath: path.join(__dirname, '..', 'public'),
      serveStaticOptions: { //кеширование
        maxAge: 10*1000, // милисекунды
      },
    }),
    RepositoryModule,
  ],
  controllers: [FilmsController, OrderController],
  providers: [configProvider, FilmsService, OrderService],
})
export class AppModule {}

