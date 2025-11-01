import { utilities as nestWinstonModuleUtilities } from 'nest-winston';
import { format, transports } from 'winston';

export class LoggerService {
  static buildConfig() {
    return {
      transports: [
        new transports.Console({
          format: format.combine(
            format.timestamp(),
            nestWinstonModuleUtilities.format.nestLike('StoreAPI', { prettyPrint: true })
          ),
        }),
      ],
    };
  }
}