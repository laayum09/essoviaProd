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
