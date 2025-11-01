"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppConfigModule = exports.validateEnv = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const zod_1 = require("zod");
const envSchema = zod_1.z.object({
    NODE_ENV: zod_1.z.enum(['production', 'development', 'test']).default('production'),
    PORT: zod_1.z.string().default('3000'),
    DATABASE_URL: zod_1.z.string(),
    JWT_SECRET: zod_1.z.string(),
    JWT_EXPIRES_IN: zod_1.z.string(),
    DISCORD_CLIENT_ID: zod_1.z.string(),
    DISCORD_CLIENT_SECRET: zod_1.z.string(),
    DISCORD_REDIRECT_URI: zod_1.z.string(),
    ROBLOX_CLIENT_ID: zod_1.z.string(),
    ROBLOX_CLIENT_SECRET: zod_1.z.string(),
    ROBLOX_REDIRECT_URI: zod_1.z.string(),
    REDIS_URL: zod_1.z.string(),
    REDIS_TOKEN: zod_1.z.string(),
    SENTRY_DSN: zod_1.z.string().optional(),
});
const validateEnv = (config) => {
    const parsed = envSchema.safeParse(config);
    if (!parsed.success) {
        const msg = parsed.error.issues.map(e => `${e.path.join('.')}: ${e.message}`).join('; ');
        throw new Error(`❌ Invalid environment variables: ${msg}`);
    }
    return parsed.data;
};
exports.validateEnv = validateEnv;
let AppConfigModule = class AppConfigModule {
};
exports.AppConfigModule = AppConfigModule;
exports.AppConfigModule = AppConfigModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                validate: exports.validateEnv,
            }),
        ],
    })
], AppConfigModule);
//# sourceMappingURL=config.module.js.map