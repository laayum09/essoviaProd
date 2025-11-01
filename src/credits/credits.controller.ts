import { Body, Controller, Post } from '@nestjs/common';
import { CreditsService } from './credits.service';

@Controller('credits')
export class CreditsController {
  constructor(private readonly credits: CreditsService) {}

  @Post('set')
  async set(@Body() body: { databaseid: string; amount: number }) {
    return this.credits.set(body.databaseid, body.amount);
  }

  @Post('add')
  async add(@Body() body: { databaseid: string; amount: number }) {
    return this.credits.add(body.databaseid, body.amount);
  }

  @Post('minus')
  async minus(@Body() body: { databaseid: string; amount: number }) {
    return this.credits.minus(body.databaseid, body.amount);
  }
}