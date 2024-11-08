import type winston from 'winston';
import type { Connection } from 'vscode-languageserver';
/**
 * Language server log formatter options.
 */
export type LanguageServerFormatterOptions = {
    connection: Connection;
    preferredKeyOrder?: string[];
};
/**
 * Language server formatter for winston.
 */
export declare class LanguageServerFormatter {
    options: LanguageServerFormatterOptions;
    constructor(options: LanguageServerFormatterOptions);
    transform(info: winston.Logform.TransformableInfo & {
        [key: string | symbol]: any;
    }): winston.Logform.TransformableInfo;
}
