import {
  Controller,
  Get,
  Query,
  BadRequestException,
  InternalServerErrorException,
  Res,
  Injectable,
} from '@nestjs/common';
import type { Response } from 'express';
import axios from 'axios';
import { PrismaService } from '../infra/prisma/prisma.service';
import { genBase36Id } from '../common/utils/id.util';
import { RedisService } from '../infra/redis/redis.service';

@Injectable()
@Controller('auth')
export class AuthController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  // Step 1: Start OAuth flow
  @Get('start')
  start(@Res() res: Response, @Query('provider') provider?: string) {
    const discordAuthUrl =
      `${process.env.DISCORD_AUTH_URL}?client_id=${process.env.DISCORD_CLIENT_ID}` +
      `&response_type=code` +
      `&redirect_uri=${encodeURIComponent(process.env.DISCORD_REDIRECT_URI!)}` +
      `&scope=identify+openid`;

    const robloxAuthUrl =
      `${process.env.ROBLOX_AUTH_URL}?client_id=${process.env.ROBLOX_CLIENT_ID}` +
      `&response_type=code` +
      `&redirect_uri=${encodeURIComponent(process.env.ROBLOX_REDIRECT_URI!)}` +
      `&scope=openid+profile`;

    // If provider=roblox → redirect to Roblox OAuth; otherwise → Discord
    if (provider === 'roblox') return res.redirect(robloxAuthUrl);
    return res.redirect(discordAuthUrl);
  }

  // Step 2: Discord OAuth callback
  @Get('discord/callback')
  async discordCallback(@Query('code') code: string, @Res() res: Response) {
    if (!code) throw new BadRequestException('Missing Discord code');

    try {
      const tokenResponse = await axios.post(
        process.env.DISCORD_TOKEN_URL!,
        new URLSearchParams({
          client_id: process.env.DISCORD_CLIENT_ID!,
          client_secret: process.env.DISCORD_CLIENT_SECRET!,
          grant_type: 'authorization_code',
          code,
          redirect_uri: process.env.DISCORD_REDIRECT_URI!,
        }),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
      );

      const userResponse = await axios.get(process.env.DISCORD_USER_URL!, {
        headers: { Authorization: `Bearer ${tokenResponse.data.access_token}` },
      });

      const discordId = userResponse.data.id;
      const discordUsername = userResponse.data.username;

      // Store Discord info temporarily in Redis (expires in 5 minutes)
      await this.redis.set(`link:${discordId}`, { discordId, discordUsername }, 300);

      console.log(`🕓 Stored temporary Discord link for ${discordUsername} (${discordId})`);

      // Redirect user to frontend for Roblox linking
      return res.redirect(
        `https://essovia.xyz/collect-roblox?discordId=${discordId}&username=${discordUsername}`,
      );
    } catch (err) {
      console.error('Discord OAuth failed:', err);
      throw new InternalServerErrorException('Discord authentication failed');
    }
  }

  // Step 3: Roblox OAuth callback
  @Get('roblox/callback')
  async robloxCallback(@Query('code') code: string, @Res() res: Response) {
    if (!code) throw new BadRequestException('Missing Roblox code');

    try {
      const tokenResponse = await axios.post(
        process.env.ROBLOX_TOKEN_URL!,
        new URLSearchParams({
          client_id: process.env.ROBLOX_CLIENT_ID!,
          client_secret: process.env.ROBLOX_CLIENT_SECRET!,
          grant_type: 'authorization_code',
          code,
          redirect_uri: process.env.ROBLOX_REDIRECT_URI!,
        }),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
      );

      const userResponse = await axios.get(process.env.ROBLOX_USER_URL!, {
        headers: { Authorization: `Bearer ${tokenResponse.data.access_token}` },
      });

      const robloxId = String(userResponse.data.id || userResponse.data.userId || userResponse.data.sub);
      const robloxUsername = userResponse.data.name || userResponse.data.username || 'unknown';

      // ✅ Find any recent Discord session (within TTL)
      // Option A: if you passed discordId in frontend redirect:
      const discordId = userResponse.data.state || null;

      let discordEntry = discordId
        ? await this.redis.get<{ discordId: string; discordUsername: string }>(`link:${discordId}`)
        : null;

      // Option B: fallback to searching (only needed if no state param)
      if (!discordEntry) {
        console.warn('⚠️ No pending Discord link found in Redis.');
        return res.redirect('https://essovia.xyz/link-expired');
      }

      const { discordUsername } = discordEntry;

      // Generate a new databaseId
      let databaseId = '';
      do {
        databaseId = genBase36Id(14);
      } while (await this.prisma.user.findUnique({ where: { databaseId } }));

      // Create the new linked user
      await this.prisma.user.create({
        data: {
          databaseId,
          discordId,
          robloxId,
          credits: 0,
        },
      });

      // Remove the temp Redis record
      await this.redis.del(`link:${discordId}`);

      console.log(`✅ Linked ${discordUsername} (${discordId}) ↔ ${robloxUsername} (${robloxId})`);

      // Redirect to success page
      return res.redirect(
        `https://essovia.xyz/link-success?discordId=${discordId}&robloxId=${robloxId}`,
      );
    } catch (err) {
      console.error('Roblox OAuth failed:', err);
      throw new InternalServerErrorException('Roblox authentication failed');
    }
  }
}