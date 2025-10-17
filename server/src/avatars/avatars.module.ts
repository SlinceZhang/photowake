import { Module } from '@nestjs/common';
import { AvatarsController } from './avatars.controller';
import { AvatarsService } from './avatars.service';
import { CacheMetricsInterceptor } from '../common/interceptors/cache-metrics.interceptor';

@Module({
  controllers: [AvatarsController],
  providers: [AvatarsService, CacheMetricsInterceptor],
  exports: [AvatarsService],
})
export class AvatarsModule {}
