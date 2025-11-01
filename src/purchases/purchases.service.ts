import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../infra/prisma/prisma.service';

@Injectable()
export class PurchasesService {
  constructor(private readonly prisma: PrismaService) {}

  async add(databaseId: string, productId: string) {
    const user = await this.prisma.user.findUnique({ where: { databaseId } });
    if (!user) throw new NotFoundException('User not found');

    const product = await this.prisma.product.findUnique({ where: { productId } });
    if (!product) throw new NotFoundException('Product not found');

    const existing = await this.prisma.userProduct.findUnique({
      where: { user_databaseId_productId: { userDatabaseId: databaseId, productId } },
    });
    if (existing) return existing;

    return this.prisma.userProduct.create({
      data: {
        userDatabaseId: databaseId,
        productId,
        whitelistSetup: false,
      },
    });
  }

  async revoke(databaseId: string, productId: string) {
    const exists = await this.prisma.userProduct.findUnique({
      where: { user_databaseId_productId: { userDatabaseId: databaseId, productId } },
    });
    if (!exists) throw new NotFoundException('User does not own this product');

    await this.prisma.userProduct.delete({
      where: { user_databaseId_productId: { userDatabaseId: databaseId, productId } },
    });

    return { ok: true };
  }

  async buy(databaseId: string, productId: string, method: 'R' | 'C' | 'U') {
    const product = await this.prisma.product.findUnique({ where: { productId } });
    if (!product) throw new NotFoundException('Product not found');

    const user = await this.prisma.user.findUnique({ where: { databaseId } });
    if (!user) throw new NotFoundException('User not found');

    // Method U (Unrestricted): directly add
    if (method === 'U' || method === 'R') {
      return this.add(databaseId, productId);
    }

    // Method C (Credits): check balance and deduct
    if (method === 'C') {
      const price = product.priceC ?? 0;
      if (user.credits < price)
        throw new BadRequestException('Insufficient credits');

      await this.prisma.user.update({
        where: { databaseId },
        data: { credits: user.credits - price },
      });

      return this.add(databaseId, productId);
    }

    throw new BadRequestException('Invalid payment method');
  }

  async ownedProducts(databaseId: string) {
    return this.prisma.userProduct.findMany({
      where: { userDatabaseId: databaseId },
      include: { },
    });
  }
}