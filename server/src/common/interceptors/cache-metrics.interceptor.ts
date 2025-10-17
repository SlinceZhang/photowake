import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  StreamableFile,
} from '@nestjs/common';
import { CacheInterceptor, CACHE_TTL_METADATA } from '@nestjs/cache-manager';
import { Reflector } from '@nestjs/core';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import type { Cache } from 'cache-manager';

function isNil(value: unknown): value is null | undefined {
  return value === null || value === undefined;
}

function isFunction<T extends (...args: any[]) => any>(value: unknown): value is T {
  return typeof value === 'function';
}

function stableSerialize(value: any): string {
  if (Array.isArray(value)) {
    return `[${value.map((item) => stableSerialize(item)).join(',')}]`;
  }

  if (value && typeof value === 'object') {
    const entries = Object.keys(value)
      .sort()
      .map((key) => `${key}:${stableSerialize(value[key])}`);
    return `{${entries.join(',')}}`;
  }

  return JSON.stringify(value);
}

@Injectable()
export class CacheMetricsInterceptor extends CacheInterceptor {
  private readonly logger = new Logger(CacheMetricsInterceptor.name);

  constructor(cacheManager: Cache, reflector: Reflector) {
    super(cacheManager, reflector);
    this.allowedMethods = ['GET', 'POST'];
  }

  protected override trackBy(context: ExecutionContext): string | undefined {
    const baseKey = super.trackBy(context);
    if (!baseKey) {
      return baseKey;
    }

    const request = context.switchToHttp().getRequest();
    if (request?.method === 'POST') {
      return `${baseKey}::${stableSerialize(request.body ?? {})}`;
    }

    return baseKey;
  }

  override async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const cacheKey = this.trackBy(context);
    if (!cacheKey) {
      return next.handle();
    }

    try {
      const cachedValue = await this.cacheManager.get(cacheKey);
      this.setHeadersWhenHttp(context, cachedValue);

      if (!isNil(cachedValue)) {
        this.logger.log(`cache hit key=${cacheKey}`);
        return of(cachedValue);
      }

      this.logger.log(`cache miss key=${cacheKey}`);

      const ttlValueOrFactory =
        this.reflector.get(CACHE_TTL_METADATA, context.getHandler()) ??
        this.reflector.get(CACHE_TTL_METADATA, context.getClass()) ??
        null;

      const ttl = isFunction<(context: ExecutionContext) => Promise<number> | number>(
        ttlValueOrFactory,
      )
        ? await ttlValueOrFactory(context)
        : ttlValueOrFactory;

      return next.handle().pipe(
        tap(async (response) => {
          if (response instanceof StreamableFile) {
            return;
          }

          const args: [string, any, number?] = [cacheKey, response];
          if (!isNil(ttl)) {
            args.push(ttl);
          }

          try {
            await this.cacheManager.set(...args);
            this.logger.debug(
              `cache store key=${cacheKey} ttl=${isNil(ttl) ? 'default' : ttl}`,
            );
          } catch (error) {
            this.logger.error(
              `cache store failure key=${cacheKey}`,
              error instanceof Error ? error.stack : undefined,
            );
          }
        }),
      );
    } catch (error) {
      this.logger.warn(
        `cache retrieval failure key=${cacheKey}: ${
          error instanceof Error ? error.message : error
        }`,
      );
      return next.handle();
    }
  }
}
