import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './infra/prisma/prisma.module';
import { RedisModule } from './infra/redis/redis.module';
import { ProductsModule } from './products/products.module';
import { CreditsModule } from './credits/credits.module';
import { PurchasesModule } from './purchases/purchases.module';
import { WhitelistModule } from './whitelist/whitelist.module';
import { FilesModule } from './files/files.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // ✅ loads .env automatically
    PrismaModule,
    RedisModule, // ✅ adds Redis + CacheService globally
    AuthModule,
    UsersModule,
    ProductsModule,
    CreditsModule,
    PurchasesModule,
    WhitelistModule,
    FilesModule,
  ],
})
export class AppModule {}