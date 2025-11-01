import { JwtService } from '@nestjs/jwt';
export declare class JwtTokenService {
    private readonly jwtService;
    constructor(jwtService: JwtService);
    sign(payload: Record<string, any>): string;
    verify(token: string): any;
}
