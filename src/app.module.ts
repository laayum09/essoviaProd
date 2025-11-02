import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { InfraModule } from './infra/infra.module';
import { HealthModule } from './health/health.module';
import { ProductsModule } from './products/products.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CreditsModule } from './credits/credits.module';
import { WhitelistModule } from './whitelist/whitelist.module';
import { PurchasesModule } from './purchases/purchases.module';
import { RedisModule } from './infra/redis/redis.module';
import { PrismaModule } from './infra/prisma/prisma.module';
import { LoggerModule } from './infra/logger/logger.module';
import { FilesModule } from './files/files.module';

@Module({
  imports: [
    // 🔧 Config (loads .env)
    ConfigModule.forRoot({ isGlobal: true }),

    // ⚙️ Infrastructure
    InfraModule,
    PrismaModule,
    RedisModule,
    LoggerModule,
    FilesModule,

    // 🧩 Core feature modules
    HealthModule,
    AuthModule,
    UsersModule,
    ProductsModule,
    CreditsModule,
    WhitelistModule,
    PurchasesModule,
  ],
})
export class AppModule {}