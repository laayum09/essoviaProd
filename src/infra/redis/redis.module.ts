import { Module, Global } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { Redis } from '@upstash/redis';
import { CacheService } from './redis.service';

@Global()
@Module({
  imports: [
    CacheModule.registerAsync({
      useFactory: () => ({
        ttl: 60 * 60, // default 1 hour
        isGlobal: true,
      }),
    }),
  ],
  providers: [
    CacheService,
    {
      provide: 'REDIS_CLIENT',
      useFactory: () => {
        return new Redis({
          url: process.env.REDIS_URL!,
          token: process.env.REDIS_TOKEN!,
        });
      },
    },
  ],
  exports: ['REDIS_CLIENT', CacheService, CacheModule],
})
export class RedisModule {}