import { Body, Controller, Get, HttpCode, Post, Query, UseInterceptors } from '@nestjs/common';
import { CacheTTL } from '@nestjs/cache-manager';
import { AvatarsService } from './avatars.service';
import { CursorPaginationDto } from './dto/cursor-pagination.dto';
import { AvatarBatchDto } from './dto/avatar-batch.dto';
import { buildApiResponse } from '../common/dto/api-response.dto';
import { CacheMetricsInterceptor } from '../common/interceptors/cache-metrics.interceptor';

@Controller('avatars')
@UseInterceptors(CacheMetricsInterceptor)
export class AvatarsController {
  constructor(private readonly avatarsService: AvatarsService) {}

  @Get()
  @CacheTTL(30_000)
  getMany(@Query() paginationDto: CursorPaginationDto) {
    const result = this.avatarsService.findMany(paginationDto);
    return buildApiResponse(result);
  }

  @Post('batch')
  @HttpCode(200)
  @CacheTTL(60_000)
  getBatch(@Body() batchDto: AvatarBatchDto) {
    const items = this.avatarsService.findBatch(batchDto);
    return buildApiResponse({ items, nextCursor: null });
  }
}
