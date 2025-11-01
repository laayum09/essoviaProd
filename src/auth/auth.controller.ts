import {
  Controller,
  Get,
  Query,
  BadRequestException,
  InternalServerErrorException,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import axios from 'axios';

@Controller('auth')
export class AuthController {
  // Step 1: Provide OAuth URLs for both Discord & Roblox
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

  // Step 2: Combined account creation route
  @Get('account-creation')
  async accountCreation() {
    try {
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

      return {
        success: true,
        discordAuthUrl,
        robloxAuthUrl,
      };
    } catch (err) {
      console.error('Account creation failed:', err);
      throw new InternalServerErrorException('Account creation route failed');
    }
  }

  // Step 3: Discord OAuth callback
  @Get('discord/callback')
  async discordCallback(@Query('code') code: string) {
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

      return {
        discordId: userResponse.data.id,
        discordUsername: userResponse.data.username,
      };
    } catch (err) {
      console.error('Discord OAuth failed:', err);
      throw new InternalServerErrorException('Discord authentication failed');
    }
  }

  // Step 4: Roblox OAuth callback
  @Get('roblox/callback')
  async robloxCallback(@Query('code') code: string) {
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

      return {
        robloxId: String(userResponse.data.id || userResponse.data.userId || userResponse.data.sub),
        robloxUsername: userResponse.data.name || userResponse.data.username || 'unknown',
      };
    } catch (err) {
      console.error('Roblox OAuth failed:', err);
      throw new InternalServerErrorException('Roblox authentication failed');
    }
  }
}