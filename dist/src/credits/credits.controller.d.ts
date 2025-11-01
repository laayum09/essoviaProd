import { CreditsService } from './credits.service';
export declare class CreditsController {
    private readonly credits;
    constructor(credits: CreditsService);
    set(body: {
        databaseid: string;
        amount: number;
    }): Promise<{
        credits: number;
    }>;
    add(body: {
        databaseid: string;
        amount: number;
    }): Promise<{
        credits: number;
    }>;
    minus(body: {
        databaseid: string;
        amount: number;
    }): Promise<{
        credits: number;
    }>;
}
