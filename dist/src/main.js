"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const cors_1 = __importDefault(require("cors"));
const common_1 = require("@nestjs/common");
const nest_winston_1 = require("nest-winston");
const winston_logger_1 = require("./infra/logger/winston.logger");
const all_exception_filter_1 = require("./common/filters/all-exception.filter");
const http = __importStar(require("http"));
const Sentry = __importStar(require("@sentry/node"));
const rate_limiter_flexible_1 = require("rate-limiter-flexible");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        bufferLogs: true,
        logger: nest_winston_1.WinstonModule.createLogger(winston_logger_1.winstonOptions),
    });
    app.use((0, helmet_1.default)({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
    app.use((0, compression_1.default)());
    app.use((0, cors_1.default)({ origin: true, credentials: true }));
    const limiter = new rate_limiter_flexible_1.RateLimiterMemory({ points: 10, duration: 1 });
    app.use(async (req, res, next) => {
        try {
            await limiter.consume(req.ip);
            next();
        }
        catch {
            res.status(429).send('Too many requests');
        }
    });
    app.useGlobalPipes(new common_1.ValidationPipe({ whitelist: true, transform: true }));
    app.useGlobalFilters(new all_exception_filter_1.AllExceptionsFilter());
    app.use((req, res, next) => {
        res.setHeader('Cache-Control', 'public, max-age=60');
        next();
    });
    const port = Number(process.env.PORT ?? 8080);
    const server = http.createServer(app.getHttpAdapter().getInstance());
    server.keepAliveTimeout = 65000;
    server.headersTimeout = 66000;
    await app.listen(port, '0.0.0.0');
    console.log(`✅ Essovia API running on port ${port}`);
}
Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.SENTRY_ENVIRONMENT ?? 'production',
    tracesSampleRate: 1.0,
});
bootstrap();
//# sourceMappingURL=main.js.map