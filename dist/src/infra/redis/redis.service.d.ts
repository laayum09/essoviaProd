export declare class RedisService {
    private readonly client;
    constructor();
    get(key: string): Promise<string | null>;
    set(key: string, value: any, ttlSeconds?: number): Promise<void>;
    ping(): Promise<string>;
}
