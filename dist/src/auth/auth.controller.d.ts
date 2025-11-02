import type { Response } from 'express';
import { PrismaService } from '../infra/prisma/prisma.service';
import { RedisService } from '../infra/redis/redis.service';
export declare class AuthController {
    private readonly prisma;
    private readonly redis;
    constructor(prisma: PrismaService, redis: RedisService);
    start(res: Response, provider?: string): void;
    discordCallback(code: string, res: Response): Promise<void>;
    collectRoblox(discordId: string, username: string, res: Response): void | Response<any, Record<string, any>>;
    robloxCallback(code: string, state?: string, res?: Response): Promise<void | undefined>;
    authCompleted(discordId: string, robloxId: string, robloxUsername: string): Promise<{
        message: string;
        user: {
            id: string;
            discordId: string;
            robloxId: string;
            databaseId: string;
            credits: number;
        };
    }>;
}
