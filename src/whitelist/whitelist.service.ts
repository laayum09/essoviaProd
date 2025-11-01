import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../infra/prisma/prisma.service';
import { genNumericId } from '../common/utils/id.util';

type WhitelistType = 'user' | 'group';

@Injectable()
export class WhitelistService {
  constructor(private readonly prisma: PrismaService) {}

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

  async auth(databaseId: string, productId: string, whitelistId: string) {
    const entry = await this.prisma.whitelist.findUnique({ where: { whitelistId } });
    if (!entry) throw new NotFoundException('Whitelist not found');

    const valid = entry.userDatabaseId === databaseId && entry.productId === productId;
    return { authorized: valid };
  }

  async listForUser(databaseId: string) {
    return this.prisma.whitelist.findMany({ where: { userDatabaseId: databaseId } });
  }

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