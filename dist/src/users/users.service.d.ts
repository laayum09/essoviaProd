import { PrismaService } from '../infra/prisma/prisma.service';
export declare class UsersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    completeAccount(discordId: string, robloxId: string): Promise<{
        id: string;
        discordId: string;
        robloxId: string;
        databaseId: string;
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
                version: string | null;
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
                version: string | null;
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
        discordId: string;
        robloxId: string;
        databaseId: string;
        credits: number;
    }) | null>;
    findByDatabaseId(databaseId: string): Promise<{
        id: string;
        discordId: string;
        robloxId: string;
        databaseId: string;
        credits: number;
    }>;
    findByDiscordId(discordId: string): Promise<({
        whitelists: {
            id: string;
            productId: string;
            whitelistId: string;
            userDatabaseId: string;
            type: string;
            userid: string;
        }[];
        products: {
            id: string;
            productId: string;
            userDatabaseId: string;
            whitelistSetup: boolean;
        }[];
    } & {
        id: string;
        discordId: string;
        robloxId: string;
        databaseId: string;
        credits: number;
    }) | null>;
    all(): Promise<{
        id: string;
        discordId: string;
        robloxId: string;
        databaseId: string;
        credits: number;
    }[]>;
}
