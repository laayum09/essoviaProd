"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RobloxStrategy = void 0;
const passport_1 = require("@nestjs/passport");
const common_1 = require("@nestjs/common");
const passport_oauth2_1 = require("passport-oauth2");
const axios_1 = __importDefault(require("axios"));
let RobloxStrategy = class RobloxStrategy extends (0, passport_1.PassportStrategy)(passport_oauth2_1.Strategy, 'roblox') {
    constructor() {
        super({
            authorizationURL: process.env.ROBLOX_AUTH_URL,
            tokenURL: process.env.ROBLOX_TOKEN_URL,
            clientID: process.env.ROBLOX_CLIENT_ID,
            clientSecret: process.env.ROBLOX_CLIENT_SECRET,
            callbackURL: process.env.ROBLOX_REDIRECT_URI,
        });
    }
    async validate(accessToken, _refreshToken, _profile, done) {
        const user = await axios_1.default
            .get(process.env.ROBLOX_USER_URL, { headers: { Authorization: `Bearer ${accessToken}` } })
            .then(r => r.data)
            .catch(() => null);
        if (!user)
            return done(null, false);
        done(null, { robloxId: String(user.id || user.userId || user.sub) });
    }
};
exports.RobloxStrategy = RobloxStrategy;
exports.RobloxStrategy = RobloxStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], RobloxStrategy);
//# sourceMappingURL=roblox.strategy.js.map