import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { RedisService } from '../redis/redis.service';
export declare class CacheInterceptor implements NestInterceptor {
    private readonly redis;
    constructor(redis: RedisService);
    intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>>;
}
