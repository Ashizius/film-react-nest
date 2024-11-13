import { ConsoleLogger, LoggerService } from '@nestjs/common';
import { LoggerType } from '../configuration';

export default async (
  loggerType: `${LoggerType}`,
): Promise<new () => LoggerService> => {
  switch (loggerType) {
    case LoggerType.json:
      const { JsonLogger } = await import('./json.logger');
      return JsonLogger;
    case LoggerType.dev:
      const { DevLogger } = await import('./dev.logger');
      return DevLogger;
    case LoggerType.tskv:
      const { TskvLogger } = await import('./tskv.logger');
      return TskvLogger;
    default:
      return ConsoleLogger;
  }
};
