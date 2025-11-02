import {
  Controller,
  Get,
  Query,
  BadRequestException,
  InternalServerErrorException,
  Res,
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import type { Response } from 'express';
import axios from 'axios';
import { PrismaService } from '../infra/prisma/prisma.service';
import { genBase36Id } from '../common/utils/id.util';
import { RedisService } from '../infra/redis/redis.service';
import { jwtDecode } from 'jwt-decode'; // ✅ correct import for ESM

@Injectable()
@Controller('auth')
export class AuthController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  // 🌀 Step 1: Start OAuth flow
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

    if (provider === 'roblox') return res.redirect(robloxAuthUrl);
    return res.redirect(discordAuthUrl);
  }

  // 🎮 Step 2: Discord OAuth callback
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

    await this.redis.set(
      `link:${discordId}`,
      { discordId, discordUsername },
      300,
    );

    console.log(`🕓 Stored temporary Discord link for ${discordUsername} (${discordId})`);

    // ✅ FIXED: add /auth prefix
    return res.redirect(
      `https://essovia.xyz/auth/collect-roblox?discordId=${discordId}&username=${discordUsername}`,
    );
  } catch (err) {
    console.error('Discord OAuth failed:', err);
    throw new InternalServerErrorException('Discord authentication failed');
  }
}
  // 🤖 Step 3: Redirect to Roblox OAuth
  @Get('collect-roblox')
  collectRoblox(
    @Query('discordId') discordId: string,
    @Query('username') username: string,
    @Res() res: Response,
  ) {
    if (!discordId || !username) {
      return res.status(400).json({ error: 'Missing discordId or username' });
    }

    const robloxAuthUrl =
      `${process.env.ROBLOX_AUTH_URL}?client_id=${process.env.ROBLOX_CLIENT_ID}` +
      `&response_type=code` +
      `&redirect_uri=${encodeURIComponent(process.env.ROBLOX_REDIRECT_URI!)}` +
      `&scope=openid+profile` +
      `&state=${encodeURIComponent(JSON.stringify({ discordId, username }))}`;

    return res.redirect(robloxAuthUrl);
  }

  // 🧩 Step 4: Roblox OAuth callback
  @Get('roblox/callback')
  async robloxCallback(
    @Query('code') code: string,
    @Query('state') state?: string,
    @Res() res?: Response, // ✅ optional to fix TS1016
  ) {
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

      const idToken = tokenResponse.data.id_token;
      const decoded: any = jwtDecode(idToken);

      const robloxId = decoded.sub;
      const robloxUsername = decoded.name || decoded.preferred_username || 'unknown';
      const discordInfo = state ? JSON.parse(state) : null;

      // Redirect to the final completion endpoint
      return res?.redirect(
        `https://essovia.xyz/auth/completed?discordId=${discordInfo?.discordId}&robloxId=${robloxId}&robloxUsername=${robloxUsername}`,
      );
    } catch (err: any) {
      console.error('Roblox OAuth failed:', err.response?.data || err.message);
      throw new InternalServerErrorException('Roblox authentication failed');
    }
  }

  // ✅ Step 5: Final completion — create user in Prisma and clear Redis
  @Get('completed')
  async authCompleted(
    @Query('discordId') discordId: string,
    @Query('robloxId') robloxId: string,
    @Query('robloxUsername') robloxUsername: string,
  ) {
    if (!discordId || !robloxId) {
      throw new BadRequestException('Missing discordId or robloxId');
    }

    // Fetch Discord info from Redis
    const redisDataRaw = await this.redis.get(`link:${discordId}`);
    if (!redisDataRaw) {
      throw new NotFoundException('Discord link expired or not found in Redis');
    }

    const redisData = JSON.parse(redisDataRaw);
    const discordUsername = redisData.discordUsername;

    // Prevent duplicate accounts
    const existingDiscord = await this.prisma.user.findUnique({ where: { discordId } });
    if (existingDiscord) throw new ConflictException('Discord account already linked');

    const existingRoblox = await this.prisma.user.findUnique({ where: { robloxId } });
    if (existingRoblox) throw new ConflictException('Roblox account already linked');

    // Generate a unique databaseId
    let databaseId = '';
    do {
      databaseId = genBase36Id(14);
    } while (await this.prisma.user.findUnique({ where: { databaseId } }));

    // Create new user in Prisma
    const newUser = await this.prisma.user.create({
      data: {
        databaseId,
        discordId,
        robloxId,
        credits: 0,
      },
    });

    // Clear Redis entry
    await this.redis.set(`link:${discordId}`, null, 1);

    console.log(`✅ User linked: ${discordUsername} (${discordId}) ↔ ${robloxUsername} (${robloxId})`);

    return {
      message: 'User successfully linked and created',
      user: newUser,
    };
  }
}