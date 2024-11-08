"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLogFunction = void 0;
/**
 * Gets the log function for the given log level for the given remote console.
 */
const getLogFunction = (remoteConsole, level) => {
    const logFunction = remoteConsole[level];
    if (typeof logFunction === 'function') {
        return logFunction;
    }
    return undefined;
};
exports.getLogFunction = getLogFunction;
//# sourceMappingURL=get-log-function.js.map