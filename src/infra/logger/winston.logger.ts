import { utilities as nestWinstonModuleUtilities } from 'nest-winston';
import * as winston from 'winston';

export const winstonOptions = {
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        nestWinstonModuleUtilities.format.nestLike('Essovia', { prettyPrint: true }),
      ),
      handleExceptions: true,
    }),
    new winston.transports.File({
      filename: 'logs/combined.log',
      maxsize: 1_000_000, // 1MB rotation
      maxFiles: 3,
    }),
  ],
};