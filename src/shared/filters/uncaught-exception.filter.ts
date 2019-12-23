import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';

@Catch(Error)
export class UncaughtExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost): void {
    const ctx: HttpArgumentsHost = host.switchToHttp();
    const response: Response = ctx.getResponse<Response>();
    const status: HttpStatus =
      exception instanceof HttpException ? exception.getStatus() : 500;
    const message: HttpStatus =
      exception instanceof HttpException
        ? exception.message
        : 'Ocorreu um erro inesperado. Por favor, tente novamente.';
    if (exception instanceof HttpException) {
      response.status(exception.getStatus()).json({
        message: exception.message,
      });
    } else {
      response.status(status).json({
        error: {
          'message': message,
        },
      });
    }
  }
}

/*
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';

@Catch(Error)
export class UncaughtExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost): void {
    const ctx: HttpArgumentsHost = host.switchToHttp();
    const response: Response = ctx.getResponse<Response>();
    if (!(exception instanceof HttpException)) {
      response.status(500).json({
        message: 'Ocorreu um erro inesperado. Por favor, tente novamente.',
      });
    }
  }
}
*/
