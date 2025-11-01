import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../infra/prisma/prisma.service';
import { genNumericId } from '../common/utils/id.util';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: {
    name: string;
    priceR?: number;
    priceC?: number;
    whitelisted: boolean;
    fileUrl?: string;
  }) {
    let productId = '';
    do {
      productId = genNumericId(8);
    } while (await this.prisma.product.findUnique({ where: { productId } }));

    return this.prisma.product.create({
      data: {
        productId,
        ...data,
      },
    });
  }

  async update(productId: string, data: any) {
    const exists = await this.prisma.product.findUnique({ where: { productId } });
    if (!exists) throw new NotFoundException('Product not found');
    return this.prisma.product.update({ where: { productId }, data });
  }

  async delete(productId: string) {
    await this.prisma.product.delete({ where: { productId } });
    return { ok: true };
  }

  async list() {
    return this.prisma.product.findMany();
  }
}