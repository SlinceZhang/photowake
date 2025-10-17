import { Logger, Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import type { KeyvStoreAdapter } from 'keyv';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AvatarsModule } from './avatars/avatars.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: true,
      isGlobal: true,
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        const ttlMs = Number(config.get('CACHE_TTL_MS') ?? 30_000);
        const refreshThreshold = Number(
          config.get('CACHE_REFRESH_THRESHOLD_MS') ?? Math.floor(ttlMs / 2),
        );
        const redisUrl =
          config.get<string>('REDIS_URL') ?? config.get<string>('REDIS_CACHE_URL');

        if (redisUrl) {
          try {
            const { redisStore } = await import('cache-manager-redis-yet');
            const store = (await redisStore({
              url: redisUrl,
              ttl: ttlMs,
            })) as unknown as KeyvStoreAdapter;

            return {
              ttl: ttlMs,
              refreshThreshold,
              stores: [store],
            };
          } catch (error) {
            const reason = error instanceof Error ? error.message : 'unknown';
            Logger.warn(
              `Failed to connect Redis cache store (${reason}), falling back to in-memory cache`,
              AppModule.name,
            );
          }
        }

        return {
          ttl: ttlMs,
          refreshThreshold,
        };
      },
    }),
    AvatarsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
