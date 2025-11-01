"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const jwt_1 = require("@nestjs/jwt");
const auth_controller_1 = require("./auth.controller");
const jwt_strategy_1 = require("./jwt.strategy");
const jwt_service_1 = require("./jwt.service");
const discord_strategy_1 = require("./oauth/discord.strategy");
const roblox_strategy_1 = require("./oauth/roblox.strategy");
const jwtSecret = process.env.JWT_SECRET;
const jwtExpiresIn = process.env.JWT_EXPIRES_IN || '1d';
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            passport_1.PassportModule.register({ session: false }),
            jwt_1.JwtModule.register({
                secret: jwtSecret,
                signOptions: {
                    expiresIn: jwtExpiresIn,
                },
            }),
        ],
        controllers: [auth_controller_1.AuthController],
        providers: [jwt_strategy_1.JwtStrategy, jwt_service_1.JwtTokenService, discord_strategy_1.DiscordAuthStrategy, roblox_strategy_1.RobloxStrategy],
        exports: [jwt_1.JwtModule, jwt_service_1.JwtTokenService, passport_1.PassportModule],
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map