import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { RedisModule } from './redis/redis.module';
import { InfraService } from './infra.service';
import { OpenTelemetryModule } from 'nestjs-otel';

@Global()
@Module({
  imports: [
    RedisModule,
    OpenTelemetryModule.forRoot({
      metrics: { hostMetrics: false },
    }),
  ],
  providers: [PrismaService, InfraService],
  exports: [PrismaService, InfraService, RedisModule, OpenTelemetryModule],
})
export class InfraModule {}