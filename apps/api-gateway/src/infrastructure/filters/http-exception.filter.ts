// importando configurações do nest
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';

// importando adapterhost
import { HttpAdapterHost } from '@nestjs/core';

// importando appError para personalização de error
import { AppError } from '@app/shared/errors/AppError';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();

    let httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
    const responseBody = {
      statusCode: 500,
      message: 'Internal server error',
      error: 'Internal Server Error',
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
    };

    if (exception instanceof HttpException) {
      httpStatus = exception.getStatus();
      const response = exception.getResponse();

      responseBody.statusCode = httpStatus;
      responseBody.error = exception.name;

      responseBody.message =
        typeof response === 'object' && (response as any).message
          ? (response as any).message
          : response;
    } else if (exception instanceof AppError) {
      httpStatus = exception.statusCode;
      responseBody.statusCode = httpStatus;
      responseBody.message = exception.message;
      responseBody.error = 'Error';
    } else if ((exception as any)?.status && (exception as any)?.message) {
      httpStatus = (exception as any).status;
      responseBody.statusCode = httpStatus;
      responseBody.message = (exception as any).message;
      responseBody.error = (exception as any).code || 'Microservice Error';
    } else if ((exception as any)?.error && (exception as any)?.message) {
      const rpcError = (exception as any).error;
      if (typeof rpcError === 'object') {
        httpStatus = rpcError.status || 500;
        responseBody.statusCode = httpStatus;
        responseBody.message = rpcError.message || (exception as any).message;
      }
    }

    if (httpStatus === 500) {
      this.logger.error(exception);
    }

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
