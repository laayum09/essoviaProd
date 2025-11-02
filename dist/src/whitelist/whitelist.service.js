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
exports.WhitelistService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../infra/prisma/prisma.service");
const id_util_1 = require("../common/utils/id.util");
let WhitelistService = class WhitelistService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async setup(databaseId, productId, type, userid) {
        const userProduct = await this.prisma.userProduct.findUnique({
            where: { user_databaseId_productId: { userDatabaseId: databaseId, productId } },
        });
        if (!userProduct)
            throw new common_1.NotFoundException('User does not own this product');
        if (userProduct.whitelistSetup)
            throw new common_1.BadRequestException('Whitelist already set up');
        let whitelistId = '';
        do {
            whitelistId = (0, id_util_1.genNumericId)(12);
        } while (await this.prisma.whitelist.findUnique({ where: { whitelistId } }));
        await this.prisma.whitelist.create({
            data: { userDatabaseId: databaseId, productId, whitelistId, type, userid },
        });
        await this.prisma.userProduct.update({
            where: { user_databaseId_productId: { userDatabaseId: databaseId, productId } },
            data: { whitelistSetup: true },
        });
        return { whitelistId };
    }
    async auth(databaseId, productId, whitelistId) {
        const entry = await this.prisma.whitelist.findUnique({ where: { whitelistId } });
        if (!entry)
            throw new common_1.NotFoundException('Whitelist not found');
        const valid = entry.userDatabaseId === databaseId && entry.productId === productId;
        return { authorized: valid };
    }
    async listForUser(databaseId) {
        return this.prisma.whitelist.findMany({ where: { userDatabaseId: databaseId } });
    }
    async listAll() {
        return this.prisma.whitelist.findMany();
    }
    async listNonSetup(databaseId) {
        const owned = await this.prisma.userProduct.findMany({
            where: { userDatabaseId: databaseId, whitelistSetup: false },
            include: { product: true },
        });
        return owned.map((item) => ({
            productId: item.productId,
            productName: item.product.name,
            whitelistSetup: false,
        }));
    }
    async modify(whitelistId, data) {
        const existing = await this.prisma.whitelist.findUnique({ where: { whitelistId } });
        if (!existing)
            throw new common_1.NotFoundException('Whitelist not found');
        const updated = await this.prisma.whitelist.update({
            where: { whitelistId },
            data: {
                userid: data.userid ?? existing.userid,
                type: data.type ?? existing.type,
            },
        });
        return { updated };
    }
    async reset(databaseId, productId) {
        const existing = await this.prisma.whitelist.findFirst({
            where: { userDatabaseId: databaseId, productId },
        });
        if (!existing)
            throw new common_1.NotFoundException('Whitelist not found');
        await this.prisma.whitelist.delete({ where: { whitelistId: existing.whitelistId } });
        await this.prisma.userProduct.updateMany({
            where: { userDatabaseId: databaseId, productId },
            data: { whitelistSetup: false },
        });
        return { reset: true };
    }
    async revoke(whitelistId) {
        const existing = await this.prisma.whitelist.findUnique({ where: { whitelistId } });
        if (!existing)
            throw new common_1.NotFoundException('Whitelist not found');
        await this.prisma.whitelist.delete({ where: { whitelistId } });
        await this.prisma.userProduct.updateMany({
            where: { userDatabaseId: existing.userDatabaseId, productId: existing.productId },
            data: { whitelistSetup: false },
        });
        return { revoked: true };
    }
};
exports.WhitelistService = WhitelistService;
exports.WhitelistService = WhitelistService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], WhitelistService);
//# sourceMappingURL=whitelist.service.js.map