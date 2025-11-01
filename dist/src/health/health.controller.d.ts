import type { Response } from 'express';
import { HealthService } from './health.service';
export declare class HealthController {
    private readonly health;
    constructor(health: HealthService);
    check(res: Response): Promise<Response<any, Record<string, any>>>;
}
