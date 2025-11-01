import {
  Controller,
  Post,
  Body,
  UploadedFile,
  UseInterceptors,
  Patch,
  Param,
  Delete,
  Get,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsService } from './products.service';
import { FilesService } from '../files/files.service';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly products: ProductsService,
    private readonly files: FilesService,
  ) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './tmp',
        filename: (_req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
      }),
    }),
  )
  async create(
    @Body() dto: CreateProductDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    let fileUrl: string | undefined;

    if (file) fileUrl = await this.files.uploadZip(file);

    const product = await this.products.create({
      ...dto,
      fileUrl,
    });

    return product;
  }

  @Patch(':productId')
  async update(@Param('productId') productId: string, @Body() dto: UpdateProductDto) {
    return this.products.update(productId, dto);
  }

  @Delete(':productId')
  async remove(@Param('productId') productId: string) {
    return this.products.delete(productId);
  }

  @Get()
  async list() {
    return this.products.list();
  }
}