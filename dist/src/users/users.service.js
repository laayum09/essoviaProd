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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../infra/prisma/prisma.service");
const id_util_1 = require("../common/utils/id.util");
let UsersService = class UsersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async completeAccount(discordId, robloxId) {
        const existsDiscord = await this.prisma.user.findUnique({ where: { discordId } });
        if (existsDiscord)
            throw new common_1.BadRequestException('Discord already linked');
        const existsRoblox = await this.prisma.user.findUnique({ where: { robloxId } });
        if (existsRoblox)
            throw new common_1.BadRequestException('Roblox already linked');
        let databaseId = '';
        do {
            databaseId = (0, id_util_1.genBase36Id)(14);
        } while (await this.prisma.user.findUnique({ where: { databaseId } }));
        return this.prisma.user.create({
            data: {
                databaseId,
                discordId,
                robloxId,
                credits: 0,
            },
        });
    }
    async findFullUser(id) {
        return this.prisma.user.findUnique({
            where: { id },
            include: {
                products: {
                    include: {
                        product: {
                            include: {
                                whitelists: {
                                    select: {
                                        id: true,
                                        userid: true,
                                        productId: true,
                                        user: {
                                            select: {
                                                id: true,
                                                discordId: true,
                                                robloxId: true,
                                            },
                                        },
                                        product: {
                                            select: {
                                                id: true,
                                                name: true,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                whitelists: {
                    select: {
                        id: true,
                        userid: true,
                        productId: true,
                        product: {
                            select: {
                                id: true,
                                name: true,
                                whitelisted: true,
                            },
                        },
                    },
                },
                purchases: {
                    include: {
                        product: {
                            include: {
                                whitelists: {
                                    select: {
                                        id: true,
                                        userid: true,
                                        productId: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });
    }
    async findByDatabaseId(databaseId) {
        const user = await this.prisma.user.findUnique({ where: { databaseId } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        return user;
    }
    async all() {
        return this.prisma.user.findMany({
            orderBy: { databaseId: 'asc' },
        });
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map