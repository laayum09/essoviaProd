import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../infra/prisma/prisma.service';

@Injectable()
export class CreditsService {
  constructor(private readonly prisma: PrismaService) {}

  async set(databaseId: string, amount: number) {
    if (amount < 0) throw new BadRequestException('Credits cannot be negative');
    const user = await this.prisma.user.findUnique({ where: { databaseId } });
    if (!user) throw new NotFoundException('User not found');

    const updated = await this.prisma.user.update({
      where: { databaseId },
      data: { credits: amount },
    });
    return { credits: updated.credits };
  }

  async add(databaseId: string, amount: number) {
    const user = await this.prisma.user.findUnique({ where: { databaseId } });
    if (!user) throw new NotFoundException('User not found');
    const newCredits = user.credits + amount;
    return this.set(databaseId, newCredits);
  }

  async minus(databaseId: string, amount: number) {
    const user = await this.prisma.user.findUnique({ where: { databaseId } });
    if (!user) throw new NotFoundException('User not found');

    const newCredits = user.credits - amount;
    if (newCredits < 0) throw new BadRequestException('Insufficient credits');

    return this.set(databaseId, newCredits);
  }
}