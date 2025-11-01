import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-discord-auth'; // or your chosen maintained package

@Injectable()
export class DiscordAuthStrategy extends PassportStrategy(Strategy, 'discord') {
  constructor() {
    super({
      clientId: process.env.DISCORD_CLIENT_ID!, // ✅ corrected from clientID
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
      callbackUrl: process.env.DISCORD_REDIRECT_URI!,
      scope: ['identify'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: Function) {
    done(null, profile);
  }
}