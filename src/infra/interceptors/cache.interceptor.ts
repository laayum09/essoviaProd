import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, from } from 'rxjs';
import { tap } from 'rxjs/operators';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class CacheInterceptor implements NestInterceptor {
  constructor(private readonly redis: RedisService) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest();
    const key = `cache:${req.url}`;

    const cached = await this.redis.get(key);
    if (cached) return from([JSON.parse(cached)]);

    return next.handle().pipe(
      tap(async (response) => {
        await this.redis.set(key, JSON.stringify(response), 30);
      }),
    );
  }
}