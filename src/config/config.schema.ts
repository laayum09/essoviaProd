import { z } from 'zod';

export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('production'),
  PORT: z.coerce.number().default(8080),

  DATABASE_URL: z.string().min(1),

  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be long/secure'),
  JWT_EXPIRES_IN: z.string().default('1d'),

  // Redis (Railway Redis or Upstash)
  REDIS_URL: z.string().min(1).optional(),
  REDIS_TOKEN: z.string().optional(), // Upstash style

  // Discord OAuth
  DISCORD_CLIENT_ID: z.string().min(1),
  DISCORD_CLIENT_SECRET: z.string().min(1),
  DISCORD_REDIRECT_URI: z.string().url(),
  DISCORD_AUTH_URL: z.string().url(),
  DISCORD_TOKEN_URL: z.string().url(),
  DISCORD_USER_URL: z.string().url(),

  // Roblox OAuth
  ROBLOX_CLIENT_ID: z.string().min(1),
  ROBLOX_CLIENT_SECRET: z.string().min(1),
  ROBLOX_REDIRECT_URI: z.string().url(),
  ROBLOX_AUTH_URL: z.string().url(),
  ROBLOX_TOKEN_URL: z.string().url(),
  ROBLOX_USER_URL: z.string().url(),

  // Cloudflare R2
  CLOUDFLARE_R2_ACCESS_KEY_ID: z.string().min(1),
  CLOUDFLARE_R2_SECRET_ACCESS_KEY: z.string().min(1),
  CLOUDFLARE_R2_BUCKET: z.string().min(1),
  CLOUDFLARE_R2_ACCOUNT_ID: z.string().min(1),
  CLOUDFLARE_R2_ENDPOINT: z.string().url(),
  CLOUDFLARE_R2_PUBLIC_URL: z.string().url().optional(),

  SENTRY_DSN: z.string().optional(),
  SENTRY_ENVIRONMENT: z.string().default('production'),
});
export type AppEnv = z.infer<typeof envSchema>;