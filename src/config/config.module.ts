import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['production', 'development', 'test']).default('production'),
  PORT: z.string().default('3000'),
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string(),
  JWT_EXPIRES_IN: z.string(),
  DISCORD_CLIENT_ID: z.string(),
  DISCORD_CLIENT_SECRET: z.string(),
  DISCORD_REDIRECT_URI: z.string(),
  ROBLOX_CLIENT_ID: z.string(),
  ROBLOX_CLIENT_SECRET: z.string(),
  ROBLOX_REDIRECT_URI: z.string(),
  REDIS_URL: z.string(),
  REDIS_TOKEN: z.string(),
  SENTRY_DSN: z.string().optional(),
});

export const validateEnv = (config: Record<string, unknown>) => {
  const parsed = envSchema.safeParse(config);
  if (!parsed.success) {
    const msg = parsed.error.issues.map(e => `${e.path.join('.')}: ${e.message}`).join('; ');
    throw new Error(`❌ Invalid environment variables: ${msg}`);
  }
  return parsed.data;
};

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv,
    }),
  ],
})
export class AppConfigModule {}