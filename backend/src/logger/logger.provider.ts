import { ConsoleLogger, Injectable, LoggerService } from '@nestjs/common';
import switchLogger from './switch.logger';
import { ConfigService } from '@nestjs/config';
import { Providers } from '../configuration';

export const loggerProvider = {
  provide: Providers.logger,
  useFactory: async (config: ConfigService) => {
    console.log(config.get('logger'));
    const logger = await switchLogger(config.get('logger'));
    return new logger();
  },
  // можем указать зависимости, которые нужны для функции-фабрики
  inject: [ConfigService]
}
