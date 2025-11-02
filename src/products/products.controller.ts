import { Controller, Get, Post, Body, Param, Delete, NotFoundException } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly products: ProductsService) {}

  @Get()
  async list() {
    return this.products.list();
  }

  @Post()
  async create(@Body() body: any) {
    const { name, priceR, priceC, whitelisted, fileUrl } = body;

    if (!name) throw new NotFoundException('Product name is required');

    return this.products.create({
      name,
      priceR,
      priceC,
      whitelisted: !!whitelisted,
      fileUrl,
    });
  }

  @Get(':productId')
  async get(@Param('productId') productId: string) {
    const product = await this.products.list();
    const found = product.find(p => p.productId === productId);
    if (!found) throw new NotFoundException('Product not found');
    return found;
  }

  @Delete(':productId')
  async delete(@Param('productId') productId: string) {
    return this.products.delete(productId);
  }
}