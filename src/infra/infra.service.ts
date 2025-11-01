import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { RedisService } from './redis/redis.service';

@Injectable()
export class InfraService implements OnModuleInit {
  private readonly logger = new Logger(InfraService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  async onModuleInit() {
    try {
      await this.prisma.$runCommandRaw({ ping: 1 });
      this.logger.log('✅ MongoDB connected successfully');
    } catch (err) {
      this.logger.error('❌ MongoDB connection failed:', err);
    }

    try {
      const pong = await this.redis.ping();
      if (pong === 'PONG') this.logger.log('✅ Redis connected successfully');
    } catch (err) {
      this.logger.error('❌ Redis connection failed:', err);
    }
  }
}