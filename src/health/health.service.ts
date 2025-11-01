import { Injectable } from '@nestjs/common';
import { PrismaService } from '../infra/prisma/prisma.service';
import { RedisService } from '../infra/redis/redis.service';

@Injectable()
export class HealthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  async check() {
    const checks: Record<string, boolean> = {
      database: false,
      redis: false,
    };

    // ✅ MongoDB health check (uses countDocuments for safety)
    try {
      await this.prisma.product.count();
      checks.database = true;
    } catch {
      checks.database = false;
    }

    // ✅ Redis health check
    try {
      const ping = await this.redis.ping();
      checks.redis = ping === 'PONG';
    } catch {
      checks.redis = false;
    }

    return checks;
  }
}