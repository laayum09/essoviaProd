import { Strategy } from 'passport-discord-auth';
declare const DiscordAuthStrategy_base: new (options: import("passport-discord-auth").StrategyOptions) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class DiscordAuthStrategy extends DiscordAuthStrategy_base {
    constructor();
    validate(accessToken: string, refreshToken: string, profile: any, done: Function): Promise<void>;
}
export {};
