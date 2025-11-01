import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import compression from 'compression';
import cors from 'cors';
import { ValidationPipe } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { winstonOptions } from './infra/logger/winston.logger';
import { AllExceptionsFilter } from './common/filters/all-exception.filter';
import * as http from 'http';
import * as Sentry from '@sentry/node';
import { RateLimiterMemory } from 'rate-limiter-flexible';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
    logger: WinstonModule.createLogger(winstonOptions),
  });

  // --- Middleware (security + performance)
  app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
  app.use(compression());
  app.use(cors({ origin: true, credentials: true }));

  // --- Rate limiter (10 req/sec per IP)
  const limiter = new RateLimiterMemory({ points: 10, duration: 1 });
  app.use(async (req, res, next) => {
    try {
      await limiter.consume(req.ip);
      next();
    } catch {
      res.status(429).send('Too many requests');
    }
  });

  // --- Validation & filters
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalFilters(new AllExceptionsFilter());

  // --- Basic cache headers
  app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'public, max-age=60');
    next();
  });

  // --- Server optimizations
  const port = Number(process.env.PORT ?? 8080);
  const server = http.createServer(app.getHttpAdapter().getInstance());
  server.keepAliveTimeout = 65000;
  server.headersTimeout = 66000;

  await app.listen(port, '0.0.0.0');
  console.log(`✅ Essovia API running on port ${port}`);
}

// --- Initialize Sentry before app bootstrap
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.SENTRY_ENVIRONMENT ?? 'production',
  tracesSampleRate: 1.0,
});

bootstrap();