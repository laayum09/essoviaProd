import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import type { Response } from 'express';
import { HealthService } from './health.service';

@Controller('health')
export class HealthController {
  constructor(private readonly health: HealthService) {}

  @Get()
  async check(@Res() res: Response) {
    try {
      const result = await this.health.check();
      const isReady = result.database && result.redis;

      return res
        .status(isReady ? HttpStatus.OK : HttpStatus.SERVICE_UNAVAILABLE)
        .json({
          status: isReady ? 'ok' : 'error',
          timestamp: new Date().toISOString(),
          uptime: process.uptime().toFixed(0) + 's',
          version: process.env.BUILD_VERSION ?? 'dev',
          ...result,
        });
    } catch (err) {
      return res.status(500).json({
        status: 'error',
        message: err.message,
        timestamp: new Date().toISOString(),
      });
    }
  }
}