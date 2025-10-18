import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { BaseResponseDto } from '../dto/base-response.dto';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;
    const context = host.switchToHttp();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const responseBody = exception instanceof HttpException ? exception.getResponse() : null;
    const message = this.extractMessage(exception, responseBody);
    const path = httpAdapter.getRequestUrl(context.getRequest());

    const details =
      responseBody && typeof responseBody === 'object'
        ? { ...(responseBody as Record<string, unknown>), path }
        : { path };

    const payload = BaseResponseDto.failure(message, status, details);

    httpAdapter.reply(context.getResponse(), payload, status);
  }

  private extractMessage(exception: unknown, responseBody: unknown): string {
    if (typeof responseBody === 'string' && responseBody.length > 0) {
      return responseBody;
    }

    if (
      responseBody &&
      typeof responseBody === 'object' &&
      'message' in (responseBody as Record<string, unknown>)
    ) {
      const message = (responseBody as Record<string, unknown>).message;
      if (Array.isArray(message)) {
        return message.join(', ');
      }

      if (typeof message === 'string' && message.length > 0) {
        return message;
      }
    }

    if (exception instanceof HttpException) {
      return exception.message;
    }

    if (exception instanceof Error) {
      return exception.message;
    }

    return 'Internal server error';
  }
}
