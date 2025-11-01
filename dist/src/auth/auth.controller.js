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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = __importDefault(require("axios"));
let AuthController = class AuthController {
    start() {
        const discordAuthUrl = `${process.env.DISCORD_AUTH_URL}` +
            `?client_id=${process.env.DISCORD_CLIENT_ID}` +
            `&response_type=code` +
            `&redirect_uri=${encodeURIComponent(process.env.DISCORD_REDIRECT_URI)}` +
            `&scope=identify`;
        const robloxAuthUrl = `${process.env.ROBLOX_AUTH_URL}` +
            `?client_id=${process.env.ROBLOX_CLIENT_ID}` +
            `&response_type=code` +
            `&redirect_uri=${encodeURIComponent(process.env.ROBLOX_REDIRECT_URI)}` +
            `&scope=openid%20profile`;
        return { discordAuthUrl, robloxAuthUrl };
    }
    async discordCallback(code) {
        if (!code)
            throw new common_1.BadRequestException('Missing Discord code');
        try {
            const token = await axios_1.default
                .post(process.env.DISCORD_TOKEN_URL, new URLSearchParams({
                client_id: process.env.DISCORD_CLIENT_ID,
                client_secret: process.env.DISCORD_CLIENT_SECRET,
                grant_type: 'authorization_code',
                code,
                redirect_uri: process.env.DISCORD_REDIRECT_URI,
            }), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
                .then((r) => r.data);
            const user = await axios_1.default
                .get(process.env.DISCORD_USER_URL, {
                headers: { Authorization: `Bearer ${token.access_token}` },
            })
                .then((r) => r.data);
            return { discordId: user.id, discordUsername: user.username };
        }
        catch (err) {
            console.error('Discord OAuth failed:', err);
            throw new common_1.InternalServerErrorException('Discord authentication failed');
        }
    }
    async robloxCallback(code) {
        if (!code)
            throw new common_1.BadRequestException('Missing Roblox code');
        try {
            const token = await axios_1.default
                .post(process.env.ROBLOX_TOKEN_URL, new URLSearchParams({
                client_id: process.env.ROBLOX_CLIENT_ID,
                client_secret: process.env.ROBLOX_CLIENT_SECRET,
                grant_type: 'authorization_code',
                code,
                redirect_uri: process.env.ROBLOX_REDIRECT_URI,
            }), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
                .then((r) => r.data);
            const user = await axios_1.default
                .get(process.env.ROBLOX_USER_URL, {
                headers: { Authorization: `Bearer ${token.access_token}` },
            })
                .then((r) => r.data);
            return {
                robloxId: String(user.id || user.userId || user.sub),
                robloxUsername: user.name || user.username || 'unknown',
            };
        }
        catch (err) {
            console.error('Roblox OAuth failed:', err);
            throw new common_1.InternalServerErrorException('Roblox authentication failed');
        }
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Get)('start'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "start", null);
__decorate([
    (0, common_1.Get)('discord/callback'),
    __param(0, (0, common_1.Query)('code')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "discordCallback", null);
__decorate([
    (0, common_1.Get)('roblox/callback'),
    __param(0, (0, common_1.Query)('code')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "robloxCallback", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth')
], AuthController);
//# sourceMappingURL=auth.controller.js.map