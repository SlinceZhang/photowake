import { ExecutionContext } from '@nestjs/common';
import { lastValueFrom, of } from 'rxjs';
import { ResponseInterceptor } from './response.interceptor';
import { BaseResponseDto } from '../dto/base-response.dto';

describe('ResponseInterceptor', () => {
  let interceptor: ResponseInterceptor;

  beforeEach(() => {
    interceptor = new ResponseInterceptor();
  });

  it('should wrap data in a base response envelope', async () => {
    const result = await lastValueFrom(
      interceptor.intercept({} as ExecutionContext, {
        handle: () => of('test data'),
      }),
    );

    expect(result).toEqual(new BaseResponseDto({ success: true, data: 'test data', error: null }));
  });

  it('should not double wrap an existing base response envelope', async () => {
    const envelope = BaseResponseDto.success('test data');
    const result = await lastValueFrom(
      interceptor.intercept({} as ExecutionContext, {
        handle: () => of(envelope),
      }),
    );

    expect(result).toEqual(envelope);
  });
});
