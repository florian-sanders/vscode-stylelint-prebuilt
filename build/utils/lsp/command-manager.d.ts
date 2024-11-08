import * as LSP from 'vscode-languageserver-protocol';
import type { Connection, Disposable, ServerRequestHandler } from 'vscode-languageserver';
import type winston from 'winston';
/**
 * Allows registering and executing commands and their handlers by name.
 */
export declare class CommandManager implements Disposable {
    #private;
    /**
     * Instantiates a new command manager.
     */
    constructor(connection: Connection, logger?: winston.Logger);
    dispose(): void;
    /**
     * Registers a handler for a command.
     */
    on(name: string | string[], handler: ServerRequestHandler<LSP.ExecuteCommandParams, unknown, never, void>): Disposable;
    /**
     * Registers the command manager as a request handler.
     */
    register(): void;
}
