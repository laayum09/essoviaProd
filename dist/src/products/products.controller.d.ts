import { PrismaService } from '../infra/prisma/prisma.service';
export declare class ProductsController {
    private readonly prisma;
    constructor(prisma: PrismaService);
    list(): Promise<{
        id: string;
        productId: string;
        name: string;
        priceR: number | null;
        priceC: number | null;
        whitelisted: boolean;
        fileUrl: string | null;
    }[]>;
    create(body: any): Promise<{
        id: string;
        productId: string;
        name: string;
        priceR: number | null;
        priceC: number | null;
        whitelisted: boolean;
        fileUrl: string | null;
    }>;
    get(id: string): Promise<{
        id: string;
        productId: string;
        name: string;
        priceR: number | null;
        priceC: number | null;
        whitelisted: boolean;
        fileUrl: string | null;
    } | null>;
    delete(id: string): Promise<{
        id: string;
        productId: string;
        name: string;
        priceR: number | null;
        priceC: number | null;
        whitelisted: boolean;
        fileUrl: string | null;
    }>;
}
