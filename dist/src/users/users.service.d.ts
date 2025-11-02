import { PrismaService } from '../infra/prisma/prisma.service';
export declare class UsersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    completeAccount(discordId: string, robloxId: string): Promise<{
        id: string;
        databaseId: string;
        discordId: string;
        robloxId: string;
        credits: number;
    }>;
    findFullUser(id: string): Promise<({
        whitelists: {
            product: {
                id: string;
                name: string;
                whitelisted: boolean;
            };
            id: string;
            productId: string;
            userid: string;
        }[];
        purchases: ({
            product: {
                whitelists: {
                    id: string;
                    productId: string;
                    userid: string;
                }[];
            } & {
                id: string;
                productId: string;
                name: string;
                priceR: number | null;
                priceC: number | null;
                whitelisted: boolean;
                fileUrl: string | null;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            id: string;
            productId: string;
            databaseId: string;
            purchaseId: string;
            method: string;
            amount: number | null;
            timestamp: Date;
        })[];
        products: ({
            product: {
                whitelists: {
                    user: {
                        id: string;
                        discordId: string;
                        robloxId: string;
                    };
                    product: {
                        id: string;
                        name: string;
                    };
                    id: string;
                    productId: string;
                    userid: string;
                }[];
            } & {
                id: string;
                productId: string;
                name: string;
                priceR: number | null;
                priceC: number | null;
                whitelisted: boolean;
                fileUrl: string | null;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            id: string;
            productId: string;
            userDatabaseId: string;
            whitelistSetup: boolean;
        })[];
    } & {
        id: string;
        databaseId: string;
        discordId: string;
        robloxId: string;
        credits: number;
    }) | null>;
    findByDatabaseId(databaseId: string): Promise<{
        id: string;
        databaseId: string;
        discordId: string;
        robloxId: string;
        credits: number;
    }>;
    all(): Promise<{
        id: string;
        databaseId: string;
        discordId: string;
        robloxId: string;
        credits: number;
    }[]>;
}
