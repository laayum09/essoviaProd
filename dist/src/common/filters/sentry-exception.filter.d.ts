import { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
export declare class SentryExceptionFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost): void;
}
