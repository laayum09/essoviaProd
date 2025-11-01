import type { Response } from 'express';
export declare class AuthController {
    start(res: Response, provider?: string): void;
    accountCreation(): Promise<{
        success: boolean;
        discordAuthUrl: string;
        robloxAuthUrl: string;
    }>;
    discordCallback(code: string): Promise<{
        discordId: any;
        discordUsername: any;
    }>;
    robloxCallback(code: string): Promise<{
        robloxId: string;
        robloxUsername: any;
    }>;
}
