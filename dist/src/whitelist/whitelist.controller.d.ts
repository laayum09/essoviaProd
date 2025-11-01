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
        userDatabaseId: string;
        whitelistId: string;
        type: string;
        userid: string;
    }[]>;
    revoke(whitelistId: string): Promise<{
        revoked: boolean;
    }>;
}
