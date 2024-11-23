import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'dotenv/config';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './all-exceptions/all-exceptions.filter';
import { HttpAdapterHost } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { LoggerType } from './configuration';
import switchLogger from './logger/switch.logger';

async function bootstrap() {
  //создание приложения:
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  //вызов элементов приложения:
  const config = app.get(ConfigService);
  const { httpAdapter } = app.get(HttpAdapterHost);
  //настройки:
  const port = config.get<number>('port');
  const loggerType = config.get<`${LoggerType}`>('logger');

  //настройка путей и заголовков Cors
  app.setGlobalPrefix('api/afisha');
  app.enableCors();

  // выбор нужного логгера через переменную окружения:
  const logger = await switchLogger(loggerType);
  app.useLogger(new logger());

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

  await app.listen(port || 3000);
}
bootstrap();
