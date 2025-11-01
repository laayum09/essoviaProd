import { IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  discordId!: string;

  @IsString()
  robloxId!: string;
}