import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PurchasesService } from './purchases.service';

@Controller()
export class PurchasesController {
  constructor(private readonly purchases: PurchasesService) {}

  @Post('buy')
  async buy(
    @Body() body: { databaseid: string; productID: string; method: 'R' | 'C' | 'U' },
  ) {
    return this.purchases.buy(body.databaseid, body.productID, body.method);
  }

  @Post('add')
  async add(@Body() body: { databaseid: string; productid: string }) {
    return this.purchases.add(body.databaseid, body.productid);
  }

  @Post('revoke')
  async revoke(@Body() body: { databaseid: string; productid: string }) {
    return this.purchases.revoke(body.databaseid, body.productid);
  }

  @Get('owned/:databaseId')
  async owned(@Param('databaseId') databaseId: string) {
    return this.purchases.ownedProducts(databaseId);
  }
}