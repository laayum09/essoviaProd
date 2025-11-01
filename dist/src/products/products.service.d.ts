import { PrismaService } from '../infra/prisma/prisma.service';
export declare class ProductsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(data: {
        name: string;
        priceR?: number;
        priceC?: number;
        whitelisted: boolean;
        fileUrl?: string;
    }): Promise<{
        id: string;
        name: string;
        productId: string;
        priceR: number | null;
        priceC: number | null;
        whitelisted: boolean;
        fileUrl: string | null;
    }>;
    update(productId: string, data: any): Promise<{
        id: string;
        name: string;
        productId: string;
        priceR: number | null;
        priceC: number | null;
        whitelisted: boolean;
        fileUrl: string | null;
    }>;
    delete(productId: string): Promise<{
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
