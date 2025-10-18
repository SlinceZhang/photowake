import { ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { AllExceptionsFilter } from './all-exceptions.filter';

describe('AllExceptionsFilter', () => {
  const createContext = () => {
    const reply = jest.fn();
    const getRequestUrl = jest.fn().mockReturnValue('/test');
    const httpAdapterHost = {
      httpAdapter: {
        reply,
        getRequestUrl,
      },
    } as unknown as HttpAdapterHost;

    const response = {};
    const request = {};
    const host = {
      switchToHttp: () => ({
        getResponse: () => response,
        getRequest: () => request,
      }),
    } as unknown as ArgumentsHost;

    return { reply, httpAdapterHost, host, response, request, getRequestUrl };
  };

  it('should format HttpException instances into the base response envelope', () => {
    const { reply, httpAdapterHost, host, response, request, getRequestUrl } = createContext();
    const filter = new AllExceptionsFilter(httpAdapterHost);
    const exceptionPayload = { message: ['validation failed'], error: 'Bad Request' };
    const exception = new HttpException(exceptionPayload, HttpStatus.BAD_REQUEST);

    filter.catch(exception, host);

    expect(getRequestUrl).toHaveBeenCalledWith(request);
    expect(reply).toHaveBeenCalledTimes(1);

    const [, body, status] = reply.mock.calls[0];
    expect(status).toBe(HttpStatus.BAD_REQUEST);
    expect(body).toEqual(
      expect.objectContaining({
        success: false,
        data: null,
        error: {
          message: 'validation failed',
          statusCode: HttpStatus.BAD_REQUEST,
          details: {
            ...exceptionPayload,
            path: '/test',
          },
        },
      }),
    );
  });

  it('should handle non-Http exceptions with a 500 status code', () => {
    const { reply, httpAdapterHost, host } = createContext();
    const filter = new AllExceptionsFilter(httpAdapterHost);
    const exception = new Error('Unexpected error');

    filter.catch(exception, host);

    const [, body, status] = reply.mock.calls[0];
    expect(status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(body).toEqual(
      expect.objectContaining({
        success: false,
        data: null,
        error: {
          message: 'Unexpected error',
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          details: { path: '/test' },
        },
      }),
    );
  });
});
