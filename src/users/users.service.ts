import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../infra/prisma/prisma.service';
import { genBase36Id } from '../common/utils/id.util';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async completeAccount(discordId: string, robloxId: string) {
    const existsDiscord = await this.prisma.user.findUnique({ where: { discordId } });
    if (existsDiscord) throw new BadRequestException('Discord already linked');

    const existsRoblox = await this.prisma.user.findUnique({ where: { robloxId } });
    if (existsRoblox) throw new BadRequestException('Roblox already linked');

    let databaseId = '';
    do {
      databaseId = genBase36Id(14);
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

 async findFullUser(id: string) {
  return this.prisma.user.findUnique({
    where: { id },
    include: {
      products: {
        include: {
          product: {
            include: {
              whitelists: {
                select: {
                  id: true,          // ✅ whitelist ID
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
          id: true,          // ✅ whitelist ID
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

  async findByDatabaseId(databaseId: string) {
    const user = await this.prisma.user.findUnique({ where: { databaseId } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async all() {
    return this.prisma.user.findMany({
      orderBy: { databaseId: 'asc' },
    });
  }
}