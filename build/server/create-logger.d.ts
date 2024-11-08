import winston from 'winston';
import { Connection } from 'vscode-languageserver';
/**
 * Returns a Winston logger configured for the language server.
 * @param connection The language server connection.
 * @param level The log level. Defaults to `info`.
 * @param logPath If provided, adds a file transport with the given path.
 */
export declare function createLogger(connection: Connection, level?: 'error' | 'warn' | 'info' | 'debug', logPath?: string): winston.Logger;
