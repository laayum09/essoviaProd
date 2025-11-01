"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.envSchema = void 0;
const zod_1 = require("zod");
exports.envSchema = zod_1.z.object({
    NODE_ENV: zod_1.z.enum(['development', 'production', 'test']).default('production'),
    PORT: zod_1.z.coerce.number().default(8080),
    DATABASE_URL: zod_1.z.string().min(1),
    JWT_SECRET: zod_1.z.string().min(32, 'JWT_SECRET must be long/secure'),
    JWT_EXPIRES_IN: zod_1.z.string().default('1d'),
    REDIS_URL: zod_1.z.string().min(1).optional(),
    REDIS_TOKEN: zod_1.z.string().optional(),
    DISCORD_CLIENT_ID: zod_1.z.string().min(1),
    DISCORD_CLIENT_SECRET: zod_1.z.string().min(1),
    DISCORD_REDIRECT_URI: zod_1.z.string().url(),
    DISCORD_AUTH_URL: zod_1.z.string().url(),
    DISCORD_TOKEN_URL: zod_1.z.string().url(),
    DISCORD_USER_URL: zod_1.z.string().url(),
    ROBLOX_CLIENT_ID: zod_1.z.string().min(1),
    ROBLOX_CLIENT_SECRET: zod_1.z.string().min(1),
    ROBLOX_REDIRECT_URI: zod_1.z.string().url(),
    ROBLOX_AUTH_URL: zod_1.z.string().url(),
    ROBLOX_TOKEN_URL: zod_1.z.string().url(),
    ROBLOX_USER_URL: zod_1.z.string().url(),
    CLOUDFLARE_R2_ACCESS_KEY_ID: zod_1.z.string().min(1),
    CLOUDFLARE_R2_SECRET_ACCESS_KEY: zod_1.z.string().min(1),
    CLOUDFLARE_R2_BUCKET: zod_1.z.string().min(1),
    CLOUDFLARE_R2_ACCOUNT_ID: zod_1.z.string().min(1),
    CLOUDFLARE_R2_ENDPOINT: zod_1.z.string().url(),
    CLOUDFLARE_R2_PUBLIC_URL: zod_1.z.string().url().optional(),
    SENTRY_DSN: zod_1.z.string().optional(),
    SENTRY_ENVIRONMENT: zod_1.z.string().default('production'),
});
//# sourceMappingURL=config.schema.js.map