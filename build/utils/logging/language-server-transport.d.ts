import TransportStream from 'winston-transport';
import type winston from 'winston';
import type { Connection } from 'vscode-languageserver/node';
import type { TransportStreamOptions } from 'winston-transport';
/**
 * Language server log transport options.
 */
export type LanguageServerTransportOptions = TransportStreamOptions & {
    connection: Connection;
};
/**
 * Winston transport for logging through the language server connection.
 */
export declare class LanguageServerTransport extends TransportStream {
    #private;
    constructor(options: LanguageServerTransportOptions);
    log(info: winston.Logform.TransformableInfo & {
        [key: string | symbol]: any;
    }, callback: () => void): void;
}
