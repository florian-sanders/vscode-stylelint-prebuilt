"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LanguageServerFormatter = void 0;
const triple_beam_1 = require("triple-beam");
const get_log_function_1 = require("./get-log-function");
const strings_1 = require("../strings");
/**
 * Language server formatter for winston.
 */
class LanguageServerFormatter {
    constructor(options) {
        this.options = options;
    }
    transform(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    info) {
        const date = new Date();
        // h:mm:ss a.m./p.m.
        const timestamp = `${date.getHours() % 12 || 12}:${(0, strings_1.padNumber)(date.getMinutes(), 2)}:${(0, strings_1.padNumber)(date.getSeconds(), 2)} ${date.getHours() < 12 ? 'a.m.' : 'p.m.'}`;
        const messageParts = [];
        const level = String(info[triple_beam_1.LEVEL]);
        if (!(0, get_log_function_1.getLogFunction)(this.options.connection.console, level)) {
            messageParts.push(`[${(0, strings_1.padString)((0, strings_1.upperCaseFirstChar)(level), 5)} - ${timestamp}]`);
        }
        if (info.component) {
            messageParts.push(`[${String(info.component)}]`);
        }
        messageParts.push(info.message);
        delete info.component;
        delete info.timestamp;
        const keys = new Set(Object.keys({ ...info }));
        const postMessageParts = [];
        if (this.options.preferredKeyOrder) {
            for (const key of this.options.preferredKeyOrder) {
                if (keys.has(key)) {
                    postMessageParts.push(`${key}: ${JSON.stringify(info[key])}`);
                    keys.delete(key);
                    delete info[key];
                }
            }
        }
        for (const key of keys) {
            if (key === 'level' || key === 'message') {
                continue;
            }
            postMessageParts.push(`${key}: ${JSON.stringify(info[key])}`);
            delete info[key];
        }
        const message = postMessageParts.length > 0
            ? `${messageParts.join(' ')} | ${postMessageParts.join(' ')}`
            : messageParts.join(' ');
        info[triple_beam_1.MESSAGE] = message;
        info.message = message;
        return info;
    }
}
exports.LanguageServerFormatter = LanguageServerFormatter;
//# sourceMappingURL=language-server-formatter.js.map