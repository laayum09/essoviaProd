"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisModule = void 0;
const common_1 = require("@nestjs/common");
const cache_manager_1 = require("@nestjs/cache-manager");
const redis_1 = require("@upstash/redis");
const redis_service_1 = require("./redis.service");
let RedisModule = class RedisModule {
};
exports.RedisModule = RedisModule;
exports.RedisModule = RedisModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [
            cache_manager_1.CacheModule.registerAsync({
                useFactory: () => ({
                    ttl: 60 * 60,
                    isGlobal: true,
                }),
            }),
        ],
        providers: [
            redis_service_1.CacheService,
            {
                provide: 'REDIS_CLIENT',
                useFactory: () => {
                    return new redis_1.Redis({
                        url: process.env.REDIS_URL,
                        token: process.env.REDIS_TOKEN,
                    });
                },
            },
        ],
        exports: ['REDIS_CLIENT', redis_service_1.CacheService, cache_manager_1.CacheModule],
    })
], RedisModule);
//# sourceMappingURL=redis.module.js.map