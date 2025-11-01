import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
export declare class UsersController {
    private readonly users;
    constructor(users: UsersService);
    complete(dto: CreateUserDto): Promise<{
        id: string;
        databaseId: string;
        discordId: string;
        robloxId: string;
        credits: number;
    }>;
    getUser(databaseId: string): Promise<{
        id: string;
        databaseId: string;
        discordId: string;
        robloxId: string;
        credits: number;
    }>;
    list(): Promise<{
        id: string;
        databaseId: string;
        discordId: string;
        robloxId: string;
        credits: number;
    }[]>;
}
