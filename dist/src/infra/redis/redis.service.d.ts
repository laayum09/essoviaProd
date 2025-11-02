export declare class RedisService {
    private readonly client;
    constructor();
    get<T = any>(key: string): Promise<T | null>;
    set(key: string, value: any, ttlSeconds?: number): Promise<void>;
    del(key: string): Promise<void>;
    ping(): Promise<string>;
}
