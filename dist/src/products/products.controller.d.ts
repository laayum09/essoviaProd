import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsService } from './products.service';
import { FilesService } from '../files/files.service';
export declare class ProductsController {
    private readonly products;
    private readonly files;
    constructor(products: ProductsService, files: FilesService);
    create(dto: CreateProductDto, file?: Express.Multer.File): Promise<{
        id: string;
        name: string;
        productId: string;
        priceR: number | null;
        priceC: number | null;
        whitelisted: boolean;
        fileUrl: string | null;
    }>;
    update(productId: string, dto: UpdateProductDto): Promise<{
        id: string;
        name: string;
        productId: string;
        priceR: number | null;
        priceC: number | null;
        whitelisted: boolean;
        fileUrl: string | null;
    }>;
    remove(productId: string): Promise<{
        ok: boolean;
    }>;
    list(): Promise<{
        id: string;
        name: string;
        productId: string;
        priceR: number | null;
        priceC: number | null;
        whitelisted: boolean;
        fileUrl: string | null;
    }[]>;
}
