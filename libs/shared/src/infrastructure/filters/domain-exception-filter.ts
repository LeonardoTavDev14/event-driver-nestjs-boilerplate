// importando catch e appError
import { AppError } from '@app/shared/errors/app.error';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';

@Catch()
export class DomainExceptionFilter implements ExceptionFilter {
  catch(expection: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const status =
      expection instanceof AppError
        ? expection.statusCode
        : HttpStatus.INTERNAL_SERVER_ERROR;

    response.status(status).json({
      statusCode: status,
      message: expection.message || 'Internal server error',
      path: ctx.getResponse().url,
    });
  }
}
