import { ProductsService } from './products.service';
export declare class ProductsController {
    private readonly products;
    constructor(products: ProductsService);
    list(): Promise<{
        id: string;
        productId: string;
        name: string;
        priceR: number | null;
        priceC: number | null;
        whitelisted: boolean;
        fileUrl: string | null;
        version: string | null;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    create(body: any): Promise<{
        id: string;
        productId: string;
        name: string;
        priceR: number | null;
        priceC: number | null;
        whitelisted: boolean;
        fileUrl: string | null;
        version: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    get(productId: string): Promise<{
        id: string;
        productId: string;
        name: string;
        priceR: number | null;
        priceC: number | null;
        whitelisted: boolean;
        fileUrl: string | null;
        version: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    delete(productId: string): Promise<{
        ok: boolean;
    }>;
}
