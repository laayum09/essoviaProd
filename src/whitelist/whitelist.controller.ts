import { Body, Controller, Get, Param, Post, Delete, Patch } from '@nestjs/common';
import { WhitelistService } from './whitelist.service';

@Controller('whitelist')
export class WhitelistController {
  constructor(private readonly whitelist: WhitelistService) {}

  // 🧩 Setup new whitelist
  @Post('setup')
  async setup(
    @Body() body: { databaseid: string; productid: string; type: 'user' | 'group'; userid: string },
  ) {
    return this.whitelist.setup(body.databaseid, body.productid, body.type, body.userid);
  }

  // 🔑 Authenticate whitelist
  @Post('auth')
  async auth(@Body() body: { databaseid: string; productid: string; whitelistid: string }) {
    return this.whitelist.auth(body.databaseid, body.productid, body.whitelistid);
  }

  // 👤 List whitelists for a user
  @Get(':databaseId')
  async list(@Param('databaseId') databaseId: string) {
    return this.whitelist.listForUser(databaseId);
  }

  // 👀 List all whitelists (admin)
  @Get()
  async listAll() {
    return this.whitelist.listAll();
  }

  // 🚫 List all non-setup whitelists (products owned without whitelist)
  @Get('non-setup/:databaseId')
  async listNonSetup(@Param('databaseId') databaseId: string) {
    return this.whitelist.listNonSetup(databaseId);
  }

  // 🛠️ Modify whitelist (change user or type)
  @Patch('modify/:whitelistId')
  async modify(
    @Param('whitelistId') whitelistId: string,
    @Body() body: { userid?: string; type?: 'user' | 'group' },
  ) {
    return this.whitelist.modify(whitelistId, body);
  }

  // 🔄 Reset whitelist (keep ownership)
  @Post('reset')
  async reset(@Body() body: { databaseid: string; productid: string }) {
    return this.whitelist.reset(body.databaseid, body.productid);
  }

  // ❌ Revoke whitelist (delete completely)
  @Delete(':whitelistId')
  async revoke(@Param('whitelistId') whitelistId: string) {
    return this.whitelist.revoke(whitelistId);
  }
}