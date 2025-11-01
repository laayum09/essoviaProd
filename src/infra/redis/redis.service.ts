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

  async get(key: string): Promise<string | null> {
    return await this.client.get<string>(key);
  }

  async set(key: string, value: any, ttlSeconds?: number) {
    if (ttlSeconds) {
      await this.client.set(key, JSON.stringify(value), { ex: ttlSeconds });
    } else {
      await this.client.set(key, JSON.stringify(value));
    }
  }

  async ping(): Promise<string> {
    try {
      return await this.client.ping();
    } catch {
      return 'ERROR';
    }
  }
}