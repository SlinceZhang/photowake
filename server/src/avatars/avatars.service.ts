import { Inject, Injectable, Logger } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { AVATAR_DATA } from './data/avatars.data';
import { AvatarEntity } from './entities/avatar.entity';
import { CursorPaginationDto } from './dto/cursor-pagination.dto';
import { AvatarBatchDto } from './dto/avatar-batch.dto';

const DEFAULT_LIMIT = 10;

@Injectable()
export class AvatarsService {
  private readonly logger = new Logger(AvatarsService.name);
  private readonly avatars: AvatarEntity[];
  private readonly avatarMap: Map<string, AvatarEntity>;

  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {
    this.avatars = AVATAR_DATA.map((avatar) => this.cloneAvatar(avatar)).sort(
      (a, b) => a.createdAt.localeCompare(b.createdAt),
    );
    this.avatarMap = new Map(this.avatars.map((avatar) => [avatar.id, avatar]));
  }

  findMany(pagination: CursorPaginationDto) {
    const limit = pagination.limit ?? DEFAULT_LIMIT;

    const startIndex = this.resolveStartIndex(pagination.cursor);
    const endIndex = startIndex + limit;
    const items = this.avatars.slice(startIndex, endIndex);

    const nextCursor =
      endIndex < this.avatars.length && items.length > 0
        ? items[items.length - 1].id
        : null;

    return {
      items,
      nextCursor,
    };
  }

  findBatch(batch: AvatarBatchDto) {
    return batch.ids
      .map((id) => this.avatarMap.get(id))
      .filter((avatar): avatar is AvatarEntity => Boolean(avatar));
  }

  async upsertAvatar(
    avatar: AvatarEntity,
    options: { invalidateCache?: boolean } = {},
  ) {
    const payload = this.cloneAvatar(avatar);
    const existing = this.avatarMap.get(payload.id);
    if (existing) {
      Object.assign(existing, payload);
    } else {
      this.avatars.push(payload);
      this.avatars.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
      this.avatarMap.set(payload.id, payload);
    }

    if (options.invalidateCache !== false) {
      await this.invalidateCache();
    }

    return this.avatarMap.get(payload.id)!;
  }

  async invalidateCache() {
    this.logger.debug('resetting avatar cache store');
    await this.cacheManager.clear();
  }

  getSnapshot(): AvatarEntity[] {
    return [...this.avatars];
  }

  private resolveStartIndex(cursor?: string) {
    if (!cursor) {
      return 0;
    }

    const index = this.avatars.findIndex((avatar) => avatar.id === cursor);
    if (index === -1) {
      return 0;
    }

    return index + 1;
  }

  private cloneAvatar(avatar: AvatarEntity): AvatarEntity {
    return {
      ...avatar,
      widgets: { ...avatar.widgets },
    };
  }
}
