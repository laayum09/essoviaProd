import { PrismaService } from '../infra/prisma/prisma.service';
type WhitelistType = 'user' | 'group';
export declare class WhitelistService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    setup(databaseId: string, productId: string, type: WhitelistType, userid: string): Promise<{
        whitelistId: string;
    }>;
    auth(databaseId: string, productId: string, whitelistId: string): Promise<{
        authorized: boolean;
    }>;
    listForUser(databaseId: string): Promise<{
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
    modify(whitelistId: string, data: {
        userid?: string;
        type?: WhitelistType;
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
    reset(databaseId: string, productId: string): Promise<{
        reset: boolean;
    }>;
    revoke(whitelistId: string): Promise<{
        revoked: boolean;
    }>;
}
export {};
