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
const prisma_service_1 = require("../infra/prisma/prisma.service");
const id_util_1 = require("../common/utils/id.util");
const redis_service_1 = require("../infra/redis/redis.service");
let AuthController = class AuthController {
    prisma;
    redis;
    constructor(prisma, redis) {
        this.prisma = prisma;
        this.redis = redis;
    }
    start(res, provider) {
        const discordAuthUrl = `${process.env.DISCORD_AUTH_URL}?client_id=${process.env.DISCORD_CLIENT_ID}` +
            `&response_type=code` +
            `&redirect_uri=${encodeURIComponent(process.env.DISCORD_REDIRECT_URI)}` +
            `&scope=identify+openid`;
        const robloxAuthUrl = `${process.env.ROBLOX_AUTH_URL}?client_id=${process.env.ROBLOX_CLIENT_ID}` +
            `&response_type=code` +
            `&redirect_uri=${encodeURIComponent(process.env.ROBLOX_REDIRECT_URI)}` +
            `&scope=openid+profile`;
        if (provider === 'roblox')
            return res.redirect(robloxAuthUrl);
        return res.redirect(discordAuthUrl);
    }
    async discordCallback(code, res) {
        if (!code)
            throw new common_1.BadRequestException('Missing Discord code');
        try {
            const tokenResponse = await axios_1.default.post(process.env.DISCORD_TOKEN_URL, new URLSearchParams({
                client_id: process.env.DISCORD_CLIENT_ID,
                client_secret: process.env.DISCORD_CLIENT_SECRET,
                grant_type: 'authorization_code',
                code,
                redirect_uri: process.env.DISCORD_REDIRECT_URI,
            }), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
            const userResponse = await axios_1.default.get(process.env.DISCORD_USER_URL, {
                headers: { Authorization: `Bearer ${tokenResponse.data.access_token}` },
            });
            const discordId = userResponse.data.id;
            const discordUsername = userResponse.data.username;
            await this.redis.set(`link:${discordId}`, { discordId, discordUsername }, 300);
            console.log(`🕓 Stored temporary Discord link for ${discordUsername} (${discordId})`);
            return res.redirect(`https://essovia.xyz/collect-roblox?discordId=${discordId}&username=${discordUsername}`);
        }
        catch (err) {
            console.error('Discord OAuth failed:', err);
            throw new common_1.InternalServerErrorException('Discord authentication failed');
        }
    }
    async robloxCallback(code, res) {
        if (!code)
            throw new common_1.BadRequestException('Missing Roblox code');
        try {
            const tokenResponse = await axios_1.default.post(process.env.ROBLOX_TOKEN_URL, new URLSearchParams({
                client_id: process.env.ROBLOX_CLIENT_ID,
                client_secret: process.env.ROBLOX_CLIENT_SECRET,
                grant_type: 'authorization_code',
                code,
                redirect_uri: process.env.ROBLOX_REDIRECT_URI,
            }), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
            const userResponse = await axios_1.default.get(process.env.ROBLOX_USER_URL, {
                headers: { Authorization: `Bearer ${tokenResponse.data.access_token}` },
            });
            const robloxId = String(userResponse.data.id || userResponse.data.userId || userResponse.data.sub);
            const robloxUsername = userResponse.data.name || userResponse.data.username || 'unknown';
            const discordId = userResponse.data.state || null;
            let discordEntry = discordId
                ? await this.redis.get(`link:${discordId}`)
                : null;
            if (!discordEntry) {
                console.warn('⚠️ No pending Discord link found in Redis.');
                return res.redirect('https://essovia.xyz/link-expired');
            }
            const { discordUsername } = discordEntry;
            let databaseId = '';
            do {
                databaseId = (0, id_util_1.genBase36Id)(14);
            } while (await this.prisma.user.findUnique({ where: { databaseId } }));
            await this.prisma.user.create({
                data: {
                    databaseId,
                    discordId,
                    robloxId,
                    credits: 0,
                },
            });
            await this.redis.del(`link:${discordId}`);
            console.log(`✅ Linked ${discordUsername} (${discordId}) ↔ ${robloxUsername} (${robloxId})`);
            return res.redirect(`https://essovia.xyz/link-success?discordId=${discordId}&robloxId=${robloxId}`);
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
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)('provider')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "start", null);
__decorate([
    (0, common_1.Get)('discord/callback'),
    __param(0, (0, common_1.Query)('code')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "discordCallback", null);
__decorate([
    (0, common_1.Get)('roblox/callback'),
    __param(0, (0, common_1.Query)('code')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "robloxCallback", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Injectable)(),
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        redis_service_1.RedisService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map