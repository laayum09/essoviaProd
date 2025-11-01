import { Module } from '@nestjs/common';
import { InfraModule } from './infra/infra.module';
import { HealthModule } from './health/health.module';
import { ProductsModule } from './products/products.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    InfraModule,
    HealthModule,
    ProductsModule,
    AuthModule,
    UsersModule,
  ],
})
export class AppModule {}