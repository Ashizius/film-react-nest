import {
  ArgumentsHost,
  Catch,
  ConflictException,
  HttpException,
  NotFoundException,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  private checkDBException(error: Error) {
    if (error.message) {
      const isNotFound = error.message.indexOf('not found') >= 0;
      const isCastError =
        error.message.indexOf('Cast to ObjectId failed') >= 0 ||
        error.message.indexOf('invalid input syntax for type uuid') >= 0;

      if (isNotFound || isCastError) {
        return new NotFoundException(
          'запись не найдена или передан некорректный id',
        );
      }
      if (error.message === 'не найден сеанс') {
        return new ConflictException(error.message);
      }
      if (error.message === 'не найдено свободного места') {
        return new ConflictException(error.message);
      }
    }
    return error;
  }
  catch(exception: unknown, host: ArgumentsHost) {
    if (exception instanceof HttpException) {
      return super.catch(exception, host);
    }

    if (exception instanceof Error) {
      return super.catch(this.checkDBException(exception), host);
    }

    super.catch(exception, host);
  }
}
