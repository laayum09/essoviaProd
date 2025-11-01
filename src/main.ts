import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as Sentry from '@sentry/node';
import { nodeProfilingIntegration } from '@sentry/profiling-node'; // ✅ updated import
import helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';
import { SentryExceptionFilter } from './common/filters/sentry-exception.filter';

async function bootstrap() {
  // ✅ Initialize Sentry with correct integration name
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.SENTRY_ENVIRONMENT || 'development',
    integrations: [nodeProfilingIntegration()],
    tracesSampleRate: 1.0,
    profilesSampleRate: 1.0,
  });

  const app = await NestFactory.create(AppModule);

  app.use(helmet());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useGlobalFilters(new SentryExceptionFilter());

  await app.listen(process.env.PORT || 3000);
  console.log(`🚀 API running at http://localhost:${process.env.PORT || 3000}`);
}

bootstrap();