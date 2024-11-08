"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorFormatter = void 0;
const errors_1 = require("../errors");
/**
 * Language server formatter for winston.
 */
class ErrorFormatter {
    transform(info) {
        const transformed = (0, errors_1.serializeErrors)({ ...info });
        for (const key of Object.keys(transformed)) {
            info[key] = transformed[key];
        }
        return info;
    }
}
exports.ErrorFormatter = ErrorFormatter;
//# sourceMappingURL=error-formatter.js.map