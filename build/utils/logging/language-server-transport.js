"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _LanguageServerTransport_console;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LanguageServerTransport = void 0;
const winston_transport_1 = __importDefault(require("winston-transport"));
const triple_beam_1 = require("triple-beam");
const get_log_function_1 = require("./get-log-function");
/**
 * Winston transport for logging through the language server connection.
 */
class LanguageServerTransport extends winston_transport_1.default {
    constructor(options) {
        super(options);
        /**
         * The language server remote console.
         */
        _LanguageServerTransport_console.set(this, void 0);
        __classPrivateFieldSet(this, _LanguageServerTransport_console, options.connection.console, "f");
    }
    log(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    info, callback) {
        setImmediate(() => {
            this.emit('logged', info);
        });
        try {
            const logFunc = (0, get_log_function_1.getLogFunction)(__classPrivateFieldGet(this, _LanguageServerTransport_console, "f"), String(info[triple_beam_1.LEVEL]));
            if (typeof logFunc === 'function') {
                logFunc.call(__classPrivateFieldGet(this, _LanguageServerTransport_console, "f"), String(info[triple_beam_1.MESSAGE]));
            }
            else {
                __classPrivateFieldGet(this, _LanguageServerTransport_console, "f").log(String(info[triple_beam_1.MESSAGE]));
            }
        }
        catch (error) {
            if (!(error instanceof Error) || !error.message.includes('Connection is disposed')) {
                this.emit('error', error);
            }
        }
        callback();
    }
}
exports.LanguageServerTransport = LanguageServerTransport;
_LanguageServerTransport_console = new WeakMap();
//# sourceMappingURL=language-server-transport.js.map