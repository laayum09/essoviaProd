import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Strategy as OAuth2Strategy } from 'passport-oauth2';
import axios from 'axios';

@Injectable()
export class RobloxStrategy extends PassportStrategy(OAuth2Strategy, 'roblox') {
  constructor() {
    super({
      authorizationURL: process.env.ROBLOX_AUTH_URL!,
      tokenURL: process.env.ROBLOX_TOKEN_URL!,
      clientID: process.env.ROBLOX_CLIENT_ID!,
      clientSecret: process.env.ROBLOX_CLIENT_SECRET!,
      callbackURL: process.env.ROBLOX_REDIRECT_URI!,
    });
  }

  async validate(accessToken: string, _refreshToken: string, _profile: any, done: Function) {
    const user = await axios
      .get(process.env.ROBLOX_USER_URL!, { headers: { Authorization: `Bearer ${accessToken}` } })
      .then(r => r.data)
      .catch(() => null);
    if (!user) return done(null, false);
    done(null, { robloxId: String(user.id || user.userId || user.sub) });
  }
}