import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
export declare class UsersController {
    private readonly users;
    constructor(users: UsersService);
    complete(dto: CreateUserDto): Promise<{
        id: string;
        databaseId: string;
        discordId: string;
        robloxId: string;
        credits: number;
    }>;
    getUser(databaseId: string): Promise<{
        id: string;
        databaseId: string;
        discordId: string;
        robloxId: string;
        credits: number;
    }>;
    getFullUser(id: string): Promise<({
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
        databaseId: string;
        discordId: string;
        robloxId: string;
        credits: number;
    }) | null>;
    findByDiscordId(discordId: string): Promise<{
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
        databaseId: string;
        discordId: string;
        robloxId: string;
        credits: number;
    }>;
    list(): Promise<{
        id: string;
        databaseId: string;
        discordId: string;
        robloxId: string;
        credits: number;
    }[]>;
}
