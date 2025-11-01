export declare const validateEnv: (config: Record<string, unknown>) => {
    NODE_ENV: "production" | "development" | "test";
    PORT: string;
    DATABASE_URL: string;
    JWT_SECRET: string;
    JWT_EXPIRES_IN: string;
    DISCORD_CLIENT_ID: string;
    DISCORD_CLIENT_SECRET: string;
    DISCORD_REDIRECT_URI: string;
    ROBLOX_CLIENT_ID: string;
    ROBLOX_CLIENT_SECRET: string;
    ROBLOX_REDIRECT_URI: string;
    REDIS_URL: string;
    REDIS_TOKEN: string;
    SENTRY_DSN?: string | undefined;
};
export declare class AppConfigModule {
}
