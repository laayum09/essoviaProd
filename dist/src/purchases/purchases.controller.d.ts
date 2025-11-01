import { PurchasesService } from './purchases.service';
export declare class PurchasesController {
    private readonly purchases;
    constructor(purchases: PurchasesService);
    buy(body: {
        databaseid: string;
        productID: string;
        method: 'R' | 'C' | 'U';
    }): Promise<{
        id: string;
        productId: string;
        userDatabaseId: string;
        whitelistSetup: boolean;
    }>;
    add(body: {
        databaseid: string;
        productid: string;
    }): Promise<{
        id: string;
        productId: string;
        userDatabaseId: string;
        whitelistSetup: boolean;
    }>;
    revoke(body: {
        databaseid: string;
        productid: string;
    }): Promise<{
        ok: boolean;
    }>;
    owned(databaseId: string): Promise<({} & {
        id: string;
        productId: string;
        userDatabaseId: string;
        whitelistSetup: boolean;
    })[]>;
}
