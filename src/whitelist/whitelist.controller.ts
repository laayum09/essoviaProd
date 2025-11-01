import { Body, Controller, Get, Param, Post, Delete } from '@nestjs/common';
import { WhitelistService } from './whitelist.service';

@Controller('whitelist')
export class WhitelistController {
  constructor(private readonly whitelist: WhitelistService) {}

  @Post('setup')
  async setup(
    @Body() body: { databaseid: string; productid: string; type: 'user' | 'group'; userid: string },
  ) {
    return this.whitelist.setup(body.databaseid, body.productid, body.type, body.userid);
  }

  @Post('auth')
  async auth(@Body() body: { databaseid: string; productid: string; whitelistid: string }) {
    return this.whitelist.auth(body.databaseid, body.productid, body.whitelistid);
  }

  @Get(':databaseId')
  async list(@Param('databaseId') databaseId: string) {
    return this.whitelist.listForUser(databaseId);
  }

  @Delete(':whitelistId')
  async revoke(@Param('whitelistId') whitelistId: string) {
    return this.whitelist.revoke(whitelistId);
  }
}