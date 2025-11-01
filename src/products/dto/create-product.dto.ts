import { IsBoolean, IsOptional, IsString, IsNumber } from 'class-validator';

export class CreateProductDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsNumber()
  priceR?: number;

  @IsOptional()
  @IsNumber()
  priceC?: number;

  @IsBoolean()
  whitelisted!: boolean;
}