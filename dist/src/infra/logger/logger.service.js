"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggerService = void 0;
const nest_winston_1 = require("nest-winston");
const winston_1 = require("winston");
class LoggerService {
    static buildConfig() {
        return {
            transports: [
                new winston_1.transports.Console({
                    format: winston_1.format.combine(winston_1.format.timestamp(), nest_winston_1.utilities.format.nestLike('StoreAPI', { prettyPrint: true })),
                }),
            ],
        };
    }
}
exports.LoggerService = LoggerService;
//# sourceMappingURL=logger.service.js.map