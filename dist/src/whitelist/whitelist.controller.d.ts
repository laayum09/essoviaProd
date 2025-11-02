import { WhitelistService } from './whitelist.service';
export declare class WhitelistController {
    private readonly whitelist;
    constructor(whitelist: WhitelistService);
    setup(body: {
        databaseid: string;
        productid: string;
        type: 'user' | 'group';
        userid: string;
    }): Promise<{
        whitelistId: string;
    }>;
    auth(body: {
        databaseid: string;
        productid: string;
        whitelistid: string;
    }): Promise<{
        authorized: boolean;
    }>;
    list(databaseId: string): Promise<{
        id: string;
        productId: string;
        whitelistId: string;
        userDatabaseId: string;
        type: string;
        userid: string;
    }[]>;
    listAll(): Promise<{
        id: string;
        productId: string;
        whitelistId: string;
        userDatabaseId: string;
        type: string;
        userid: string;
    }[]>;
    listNonSetup(databaseId: string): Promise<{
        productId: string;
        productName: string;
        whitelistSetup: boolean;
    }[]>;
    modify(whitelistId: string, body: {
        userid?: string;
        type?: 'user' | 'group';
    }): Promise<{
        updated: {
            id: string;
            productId: string;
            whitelistId: string;
            userDatabaseId: string;
            type: string;
            userid: string;
        };
    }>;
    reset(body: {
        databaseid: string;
        productid: string;
    }): Promise<{
        reset: boolean;
    }>;
    revoke(whitelistId: string): Promise<{
        revoked: boolean;
    }>;
}
