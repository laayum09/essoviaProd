import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaModule } from '../infra/prisma/prisma.module';

@Module({
  imports: [PrismaModule],        // ✅ gives access to PrismaService
  controllers: [UsersController], // ✅ handles /account-creation routes
  providers: [UsersService],      // ✅ main user logic
  exports: [UsersService],        // ✅ allow injection into other modules
})
export class UsersModule {}