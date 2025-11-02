import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../infra/prisma/prisma.service';
import { genNumericId } from '../common/utils/id.util';

type WhitelistType = 'user' | 'group';

@Injectable()
export class WhitelistService {
  constructor(private readonly prisma: PrismaService) {}

  // 🧩 Setup a new whitelist for a product
  async setup(databaseId: string, productId: string, type: WhitelistType, userid: string) {
    const userProduct = await this.prisma.userProduct.findUnique({
      where: { user_databaseId_productId: { userDatabaseId: databaseId, productId } },
    });
    if (!userProduct) throw new NotFoundException('User does not own this product');
    if (userProduct.whitelistSetup) throw new BadRequestException('Whitelist already set up');

    let whitelistId = '';
    do {
      whitelistId = genNumericId(12);
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

  // 🔑 Authenticate a whitelist
  async auth(databaseId: string, productId: string, whitelistId: string) {
    const entry = await this.prisma.whitelist.findUnique({ where: { whitelistId } });
    if (!entry) throw new NotFoundException('Whitelist not found');

    const valid = entry.userDatabaseId === databaseId && entry.productId === productId;
    return { authorized: valid };
  }

  // 📋 Get all whitelists for a specific user
  async listForUser(databaseId: string) {
    return this.prisma.whitelist.findMany({ where: { userDatabaseId: databaseId } });
  }

  // 🧾 List all whitelists (admin)
  async listAll() {
    return this.prisma.whitelist.findMany();
  }

  // 🚫 List products user owns but have no whitelist setup
  async listNonSetup(databaseId: string) {
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

  // 🛠️ Modify whitelist details
  async modify(whitelistId: string, data: { userid?: string; type?: WhitelistType }) {
    const existing = await this.prisma.whitelist.findUnique({ where: { whitelistId } });
    if (!existing) throw new NotFoundException('Whitelist not found');

    const updated = await this.prisma.whitelist.update({
      where: { whitelistId },
      data: {
        userid: data.userid ?? existing.userid,
        type: data.type ?? existing.type,
      },
    });

    return { updated };
  }

  // 🔄 Reset whitelist (without revoking product)
  async reset(databaseId: string, productId: string) {
    const existing = await this.prisma.whitelist.findFirst({
      where: { userDatabaseId: databaseId, productId },
    });
    if (!existing) throw new NotFoundException('Whitelist not found');

    await this.prisma.whitelist.delete({ where: { whitelistId: existing.whitelistId } });
    await this.prisma.userProduct.updateMany({
      where: { userDatabaseId: databaseId, productId },
      data: { whitelistSetup: false },
    });

    return { reset: true };
  }

  // ❌ Revoke whitelist completely
  async revoke(whitelistId: string) {
    const existing = await this.prisma.whitelist.findUnique({ where: { whitelistId } });
    if (!existing) throw new NotFoundException('Whitelist not found');

    await this.prisma.whitelist.delete({ where: { whitelistId } });
    await this.prisma.userProduct.updateMany({
      where: { userDatabaseId: existing.userDatabaseId, productId: existing.productId },
      data: { whitelistSetup: false },
    });

    return { revoked: true };
  }
}