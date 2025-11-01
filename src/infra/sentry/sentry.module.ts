import { Module, OnModuleInit } from '@nestjs/common';
import * as Sentry from '@sentry/node';

@Module({})
export class SentryModule implements OnModuleInit {
  onModuleInit() {
    if (process.env.SENTRY_DSN) {
      Sentry.init({ dsn: process.env.SENTRY_DSN });
    }
  }
}