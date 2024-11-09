import { Module } from '@nestjs/common';
import { loggerProvider } from './logger.provider';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [loggerProvider],
  exports: [loggerProvider],
})
export class LoggerModule {}

