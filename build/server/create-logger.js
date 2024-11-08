"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLogger = createLogger;
const winston_1 = __importDefault(require("winston"));
const index_1 = require("../utils/logging/index");
/**
 * Returns a Winston logger configured for the language server.
 * @param connection The language server connection.
 * @param level The log level. Defaults to `info`.
 * @param logPath If provided, adds a file transport with the given path.
 */
function createLogger(connection, level = 'info', logPath) {
    const transports = [
        new index_1.LanguageServerTransport({
            connection,
            format: winston_1.default.format.combine(new index_1.ErrorFormatter(), new index_1.LanguageServerFormatter({
                connection,
                preferredKeyOrder: ['module', 'uri', 'command'],
            })),
        }),
    ];
    if (logPath) {
        transports.push(new winston_1.default.transports.File({
            filename: logPath,
            format: winston_1.default.format.combine(new index_1.ErrorFormatter(), winston_1.default.format.timestamp(), winston_1.default.format.json()),
        }));
    }
    return winston_1.default.createLogger({
        level,
        transports,
        levels: {
            error: 0,
            warn: 1,
            info: 2,
            debug: 3,
        },
    });
}
//# sourceMappingURL=create-logger.js.map