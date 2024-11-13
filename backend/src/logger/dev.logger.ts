import { Injectable, ConsoleLogger, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.TRANSIENT })
export class DevLogger extends ConsoleLogger {
  show(obj: object) {
    const keys = Object.keys(obj);
    keys.forEach((key) => {
      console.log(`${key}=`, obj[key]);
    });
  }
  log(message: any, context?: string) {
    super.log(message, context);
  }
}
