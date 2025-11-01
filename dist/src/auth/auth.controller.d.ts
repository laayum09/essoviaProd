export declare class AuthController {
    start(): {
        discordAuthUrl: string;
        robloxAuthUrl: string;
    };
    discordCallback(code: string): Promise<{
        discordId: any;
        discordUsername: any;
    }>;
    robloxCallback(code: string): Promise<{
        robloxId: string;
        robloxUsername: any;
    }>;
}
