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
const jwt_decode_1 = require("jwt-decode");
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
    collectRoblox(discordId, username, res) {
        if (!discordId || !username) {
            return res.status(400).json({ error: 'Missing discordId or username' });
        }
        const robloxAuthUrl = `${process.env.ROBLOX_AUTH_URL}?client_id=${process.env.ROBLOX_CLIENT_ID}` +
            `&response_type=code` +
            `&redirect_uri=${encodeURIComponent(process.env.ROBLOX_REDIRECT_URI)}` +
            `&scope=openid+profile` +
            `&state=${encodeURIComponent(JSON.stringify({ discordId, username }))}`;
        return res.redirect(robloxAuthUrl);
    }
    async robloxCallback(code, state, res) {
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
            const idToken = tokenResponse.data.id_token;
            const decoded = (0, jwt_decode_1.jwtDecode)(idToken);
            const robloxId = decoded.sub;
            const robloxUsername = decoded.name || decoded.preferred_username || 'unknown';
            const discordInfo = state ? JSON.parse(state) : null;
            return res?.redirect(`https://essovia.xyz/auth/completed?discordId=${discordInfo?.discordId}&robloxId=${robloxId}&robloxUsername=${robloxUsername}`);
        }
        catch (err) {
            console.error('Roblox OAuth failed:', err.response?.data || err.message);
            throw new common_1.InternalServerErrorException('Roblox authentication failed');
        }
    }
    async authCompleted(discordId, robloxId, robloxUsername) {
        if (!discordId || !robloxId) {
            throw new common_1.BadRequestException('Missing discordId or robloxId');
        }
        const redisDataRaw = await this.redis.get(`link:${discordId}`);
        if (!redisDataRaw) {
            throw new common_1.NotFoundException('Discord link expired or not found in Redis');
        }
        const redisData = JSON.parse(redisDataRaw);
        const discordUsername = redisData.discordUsername;
        const existingDiscord = await this.prisma.user.findUnique({ where: { discordId } });
        if (existingDiscord)
            throw new common_1.ConflictException('Discord account already linked');
        const existingRoblox = await this.prisma.user.findUnique({ where: { robloxId } });
        if (existingRoblox)
            throw new common_1.ConflictException('Roblox account already linked');
        let databaseId = '';
        do {
            databaseId = (0, id_util_1.genBase36Id)(14);
        } while (await this.prisma.user.findUnique({ where: { databaseId } }));
        const newUser = await this.prisma.user.create({
            data: {
                databaseId,
                discordId,
                robloxId,
                credits: 0,
            },
        });
        await this.redis.set(`link:${discordId}`, null, 1);
        console.log(`✅ User linked: ${discordUsername} (${discordId}) ↔ ${robloxUsername} (${robloxId})`);
        return {
            message: 'User successfully linked and created',
            user: newUser,
        };
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
    (0, common_1.Get)('collect-roblox'),
    __param(0, (0, common_1.Query)('discordId')),
    __param(1, (0, common_1.Query)('username')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "collectRoblox", null);
__decorate([
    (0, common_1.Get)('roblox/callback'),
    __param(0, (0, common_1.Query)('code')),
    __param(1, (0, common_1.Query)('state')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "robloxCallback", null);
__decorate([
    (0, common_1.Get)('completed'),
    __param(0, (0, common_1.Query)('discordId')),
    __param(1, (0, common_1.Query)('robloxId')),
    __param(2, (0, common_1.Query)('robloxUsername')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "authCompleted", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Injectable)(),
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        redis_service_1.RedisService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map