import { LoggerService, Injectable, Scope } from '@nestjs/common';
import { TSKVconverter } from '../utils/tskvConverter';

@Injectable({ scope: Scope.TRANSIENT })
export class TskvLogger implements LoggerService {
  formatMessage(level: string, message: any, ...optionalParams: any[]) {
    return new TSKVconverter({ level, message, optionalParams }).stringify();
  }
  log(message: any, ...optionalParams: any[]) {
    console.log(this.formatMessage('log', message, ...optionalParams));
  }
  error(message: any, ...optionalParams: any[]) {
    console.log(this.formatMessage('error', message, ...optionalParams));
  }
  warn(message: any, ...optionalParams: any[]) {
    console.log(this.formatMessage('warn', message, ...optionalParams));
  }
}
