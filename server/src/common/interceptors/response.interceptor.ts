import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseResponseDto } from '../dto/base-response.dto';

const isBaseResponse = (value: unknown): value is BaseResponseDto<unknown> => {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  return (
    'success' in value &&
    'data' in value &&
    'error' in value &&
    typeof (value as Record<string, unknown>).success === 'boolean'
  );
};

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(
    _context: ExecutionContext,
    next: CallHandler,
  ): Observable<BaseResponseDto<unknown>> {
    return next.handle().pipe(
      map((data) => {
        if (isBaseResponse(data)) {
          return data;
        }

        const normalizedData = (data ?? null) as unknown;
        return new BaseResponseDto({ success: true, data: normalizedData, error: null });
      }),
    );
  }
}
