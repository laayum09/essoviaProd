import { PrismaService } from '../infra/prisma/prisma.service';
export declare class CreditsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    set(databaseId: string, amount: number): Promise<{
        credits: number;
    }>;
    add(databaseId: string, amount: number): Promise<{
        credits: number;
    }>;
    minus(databaseId: string, amount: number): Promise<{
        credits: number;
    }>;
}
