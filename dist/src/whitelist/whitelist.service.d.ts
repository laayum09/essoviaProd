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
        type: string;
        userDatabaseId: string;
        whitelistId: string;
        userid: string;
    }[]>;
    revoke(whitelistId: string): Promise<{
        revoked: boolean;
    }>;
}
export {};
