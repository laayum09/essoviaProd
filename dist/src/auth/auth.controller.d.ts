import type { Response } from 'express';
import { PrismaService } from '../infra/prisma/prisma.service';
import { RedisService } from '../infra/redis/redis.service';
export declare class AuthController {
    private readonly prisma;
    private readonly redis;
    constructor(prisma: PrismaService, redis: RedisService);
    start(res: Response, provider?: string): void;
    discordCallback(code: string, res: Response): Promise<void>;
    robloxCallback(code: string, res: Response): Promise<void>;
}
