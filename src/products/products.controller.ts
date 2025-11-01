import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { PrismaService } from '../infra/prisma/prisma.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async list() {
    return this.prisma.product.findMany();
  }

  @Post()
  async create(@Body() body: any) {
    return this.prisma.product.create({ data: body });
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    return this.prisma.product.findUnique({ where: { id } });
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.prisma.product.delete({ where: { id } });
  }
}