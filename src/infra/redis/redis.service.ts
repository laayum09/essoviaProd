import { Inject, Injectable, Logger } from '@nestjs/common';
import { Redis } from '@upstash/redis';

@Injectable()
export class CacheService {
  private readonly logger = new Logger(CacheService.name);

  constructor(@Inject('REDIS_CLIENT') private readonly redis: Redis) {}

  async set<T = any>(key: string, value: T, ttlSeconds = 3600): Promise<void> {
    try {
      await this.redis.set(key, JSON.stringify(value), { ex: ttlSeconds });
    } catch (err) {
      this.logger.error(`Redis SET error for ${key}: ${err.message}`);
    }
  }

  async get<T = any>(key: string): Promise<T | null> {
    try {
      const val = await this.redis.get<string>(key);
      return val ? JSON.parse(val) : null;
    } catch (err) {
      this.logger.error(`Redis GET error for ${key}: ${err.message}`);
      return null;
    }
  }

  async del(key: string): Promise<void> {
    try {
      await this.redis.del(key);
    } catch (err) {
      this.logger.error(`Redis DEL error for ${key}: ${err.message}`);
    }
  }

  async clearAll(): Promise<void> {
    try {
      await this.redis.flushdb();
    } catch (err) {
      this.logger.error(`Redis FLUSHDB error: ${err.message}`);
    }
  }
}