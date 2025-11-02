import { Injectable } from '@nestjs/common';
import { Redis } from '@upstash/redis';

@Injectable()
export class RedisService {
  private readonly client: Redis;

  constructor() {
    this.client = new Redis({
      url: process.env.REDIS_URL!,
      token: process.env.REDIS_TOKEN!,
    });
  }

  /**
   * Get a JSON-parsed value from Redis
   */
  async get<T = any>(key: string): Promise<T | null> {
    const value = await this.client.get<string>(key);
    if (!value) return null;
    try {
      return JSON.parse(value) as T;
    } catch {
      return value as any;
    }
  }

  /**
   * Set a key with optional TTL (in seconds)
   */
  async set(key: string, value: any, ttlSeconds?: number) {
    const json = JSON.stringify(value);
    if (ttlSeconds) {
      await this.client.set(key, json, { ex: ttlSeconds });
    } else {
      await this.client.set(key, json);
    }
  }

  /**
   * Delete a key
   */
  async del(key: string) {
    await this.client.del(key);
  }

  /**
   * Ping Redis
   */
  async ping(): Promise<string> {
    try {
      return await this.client.ping();
    } catch {
      return 'ERROR';
    }
  }
}