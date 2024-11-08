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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
var _CommandManager_connection, _CommandManager_logger, _CommandManager_commands;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandManager = void 0;
const LSP = __importStar(require("vscode-languageserver-protocol"));
/**
 * Allows registering and executing commands and their handlers by name.
 */
class CommandManager {
    /**
     * Instantiates a new command manager.
     */
    constructor(connection, logger) {
        /**
         * The language server connection.
         */
        _CommandManager_connection.set(this, void 0);
        /**
         * The logger to use.
         */
        _CommandManager_logger.set(this, void 0);
        /**
         * Command handlers by command name.
         */
        _CommandManager_commands.set(this, new Map());
        __classPrivateFieldSet(this, _CommandManager_connection, connection, "f");
        __classPrivateFieldSet(this, _CommandManager_logger, logger, "f");
    }
    dispose() {
        __classPrivateFieldGet(this, _CommandManager_logger, "f")?.debug('Disposing command manager');
        __classPrivateFieldGet(this, _CommandManager_commands, "f").clear();
        __classPrivateFieldGet(this, _CommandManager_connection, "f").onExecuteCommand(() => undefined);
    }
    /**
     * Registers a handler for a command.
     */
    on(name, handler) {
        if (Array.isArray(name)) {
            __classPrivateFieldGet(this, _CommandManager_logger, "f")?.debug('Registering commands', { commands: name });
            for (const commandName of name) {
                __classPrivateFieldGet(this, _CommandManager_commands, "f").set(commandName, handler);
            }
            return {
                dispose: () => {
                    __classPrivateFieldGet(this, _CommandManager_logger, "f")?.debug('Deregistering commands', { commands: name });
                    for (const commandName of name) {
                        __classPrivateFieldGet(this, _CommandManager_commands, "f").delete(commandName);
                    }
                },
            };
        }
        __classPrivateFieldGet(this, _CommandManager_logger, "f")?.debug('Registering command', { command: name });
        __classPrivateFieldGet(this, _CommandManager_commands, "f").set(name, handler);
        return {
            dispose: () => {
                __classPrivateFieldGet(this, _CommandManager_logger, "f")?.debug('Deregistering command', { command: name });
                __classPrivateFieldGet(this, _CommandManager_commands, "f").delete(name);
            },
        };
    }
    /**
     * Registers the command manager as a request handler.
     */
    register() {
        __classPrivateFieldGet(this, _CommandManager_logger, "f")?.debug('Registering ExecuteCommandRequest handler');
        __classPrivateFieldGet(this, _CommandManager_connection, "f").onExecuteCommand(async (...params) => {
            __classPrivateFieldGet(this, _CommandManager_logger, "f")?.debug('Received ExecuteCommandRequest', {
                command: params[0].command,
                arguments: params[0].arguments,
            });
            const handler = __classPrivateFieldGet(this, _CommandManager_commands, "f").get(params[0].command);
            if (!handler) {
                __classPrivateFieldGet(this, _CommandManager_logger, "f")?.debug('No handler registered for command', {
                    command: params[0].command,
                });
                return {};
            }
            __classPrivateFieldGet(this, _CommandManager_logger, "f")?.debug('Executing command', {
                command: params[0].command,
            });
            try {
                const response = await handler(...params);
                __classPrivateFieldGet(this, _CommandManager_logger, "f")?.debug('Sending command response', {
                    command: params[0].command,
                    response,
                });
                return response;
            }
            catch (error) {
                __classPrivateFieldGet(this, _CommandManager_logger, "f")?.error('Error executing command', {
                    command: params[0].command,
                    error,
                });
                return new LSP.ResponseError(LSP.ErrorCodes.InternalError, `Error executing command ${params[0].command}`, error);
            }
        });
        __classPrivateFieldGet(this, _CommandManager_logger, "f")?.debug('ExecuteCommandRequest handler registered');
    }
}
exports.CommandManager = CommandManager;
_CommandManager_connection = new WeakMap(), _CommandManager_logger = new WeakMap(), _CommandManager_commands = new WeakMap();
//# sourceMappingURL=command-manager.js.map