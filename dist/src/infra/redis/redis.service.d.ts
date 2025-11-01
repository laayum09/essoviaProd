import { Redis } from '@upstash/redis';
export declare class CacheService {
    private readonly redis;
    private readonly logger;
    constructor(redis: Redis);
    set<T = any>(key: string, value: T, ttlSeconds?: number): Promise<void>;
    get<T = any>(key: string): Promise<T | null>;
    del(key: string): Promise<void>;
    clearAll(): Promise<void>;
}
