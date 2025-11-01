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
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../infra/prisma/prisma.service");
const id_util_1 = require("../common/utils/id.util");
let ProductsService = class ProductsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        let productId = '';
        do {
            productId = (0, id_util_1.genNumericId)(8);
        } while (await this.prisma.product.findUnique({ where: { productId } }));
        return this.prisma.product.create({
            data: {
                productId,
                ...data,
            },
        });
    }
    async update(productId, data) {
        const exists = await this.prisma.product.findUnique({ where: { productId } });
        if (!exists)
            throw new common_1.NotFoundException('Product not found');
        return this.prisma.product.update({ where: { productId }, data });
    }
    async delete(productId) {
        await this.prisma.product.delete({ where: { productId } });
        return { ok: true };
    }
    async list() {
        return this.prisma.product.findMany();
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProductsService);
//# sourceMappingURL=products.service.js.map