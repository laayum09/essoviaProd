import {
  Controller,
  Get,
  Query,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import axios from 'axios';

@Controller('auth')
export class AuthController {
  // Step 1: Provide OAuth URLs for both Discord & Roblox
  @Get('start')
  start() {
    const discordAuthUrl =
      `${process.env.DISCORD_AUTH_URL}` +
      `?client_id=${process.env.DISCORD_CLIENT_ID}` +
      `&response_type=code` +
      `&redirect_uri=${encodeURIComponent(process.env.DISCORD_REDIRECT_URI!)}` +
      `&scope=identify`;

    const robloxAuthUrl =
      `${process.env.ROBLOX_AUTH_URL}` +
      `?client_id=${process.env.ROBLOX_CLIENT_ID}` +
      `&response_type=code` +
      `&redirect_uri=${encodeURIComponent(process.env.ROBLOX_REDIRECT_URI!)}` +
      `&scope=openid%20profile`;

    return { discordAuthUrl, robloxAuthUrl };
  }

  @Get('/account-creation')
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

  // Step 2: Discord OAuth callback
  @Get('discord/callback')
  async discordCallback(@Query('code') code: string) {
    if (!code) throw new BadRequestException('Missing Discord code');

    try {
      const token = await axios
        .post(
          process.env.DISCORD_TOKEN_URL!,
          new URLSearchParams({
            client_id: process.env.DISCORD_CLIENT_ID!,
            client_secret: process.env.DISCORD_CLIENT_SECRET!,
            grant_type: 'authorization_code',
            code,
            redirect_uri: process.env.DISCORD_REDIRECT_URI!,
          }),
          { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
        )
        .then((r) => r.data);

      const user = await axios
        .get(process.env.DISCORD_USER_URL!, {
          headers: { Authorization: `Bearer ${token.access_token}` },
        })
        .then((r) => r.data);

      return { discordId: user.id, discordUsername: user.username };
    } catch (err) {
      console.error('Discord OAuth failed:', err);
      throw new InternalServerErrorException('Discord authentication failed');
    }
  }

  // Step 3: Roblox OAuth callback
  @Get('roblox/callback')
  async robloxCallback(@Query('code') code: string) {
    if (!code) throw new BadRequestException('Missing Roblox code');

    try {
      const token = await axios
        .post(
          process.env.ROBLOX_TOKEN_URL!,
          new URLSearchParams({
            client_id: process.env.ROBLOX_CLIENT_ID!,
            client_secret: process.env.ROBLOX_CLIENT_SECRET!,
            grant_type: 'authorization_code',
            code,
            redirect_uri: process.env.ROBLOX_REDIRECT_URI!,
          }),
          { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
        )
        .then((r) => r.data);

      const user = await axios
        .get(process.env.ROBLOX_USER_URL!, {
          headers: { Authorization: `Bearer ${token.access_token}` },
        })
        .then((r) => r.data);

      return {
        robloxId: String(user.id || user.userId || user.sub),
        robloxUsername: user.name || user.username || 'unknown',
      };
    } catch (err) {
      console.error('Roblox OAuth failed:', err);
      throw new InternalServerErrorException('Roblox authentication failed');
    }
  }
}