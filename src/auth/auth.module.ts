import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { JwtTokenService } from './jwt.service';
import { DiscordAuthStrategy } from './oauth/discord.strategy';
import { RobloxStrategy } from './oauth/roblox.strategy';

const jwtSecret = process.env.JWT_SECRET as string;
const jwtExpiresIn = process.env.JWT_EXPIRES_IN || '1d';

@Module({
  imports: [
    PassportModule.register({ session: false }),
    JwtModule.register({
      secret: jwtSecret,
      signOptions: {
        expiresIn: jwtExpiresIn as any, // ✅ cast fixes type safely
      },
    }),
  ],
  controllers: [AuthController],
  providers: [JwtStrategy, JwtTokenService, DiscordAuthStrategy, RobloxStrategy],
  exports: [JwtModule, JwtTokenService, PassportModule],
})
export class AuthModule {}