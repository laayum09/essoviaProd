import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Post('complete')
  async complete(@Body() dto: CreateUserDto) {
    return this.users.completeAccount(dto.discordId, dto.robloxId);
  }

  @Get(':databaseId')
  async getUser(@Param('databaseId') databaseId: string) {
    return this.users.findByDatabaseId(databaseId);
  }

  @Get('/full/:id')
async getFullUser(@Param('id') id: string) {
  return this.users.findFullUser(id);
}

  @Get()
  async list() {
    return this.users.all();
  }
}