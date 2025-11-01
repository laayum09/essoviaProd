import { PrismaService } from '../infra/prisma/prisma.service';
export declare class PurchasesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    add(databaseId: string, productId: string): Promise<{
        id: string;
        productId: string;
        userDatabaseId: string;
        whitelistSetup: boolean;
    }>;
    revoke(databaseId: string, productId: string): Promise<{
        ok: boolean;
    }>;
    buy(databaseId: string, productId: string, method: 'R' | 'C' | 'U'): Promise<{
        id: string;
        productId: string;
        userDatabaseId: string;
        whitelistSetup: boolean;
    }>;
    ownedProducts(databaseId: string): Promise<({} & {
        id: string;
        productId: string;
        userDatabaseId: string;
        whitelistSetup: boolean;
    })[]>;
}
