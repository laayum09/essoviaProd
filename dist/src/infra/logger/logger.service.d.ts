import { transports } from 'winston';
export declare class LoggerService {
    static buildConfig(): {
        transports: transports.ConsoleTransportInstance[];
    };
}
