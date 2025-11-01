import { Module, Global } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { winstonOptions } from './winston.logger';
import { LoggerService } from './logger.service';

@Global() // Makes logger available across the app without importing everywhere
@Module({
  imports: [WinstonModule.forRoot(winstonOptions)],
  providers: [LoggerService],
  exports: [LoggerService],
})
export class LoggerModule {}