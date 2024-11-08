import { Disposable } from 'vscode-languageserver-protocol';
import { LanguageServerConstructorParameters } from './types';
/**
 * Stylelint language server.
 */
export declare class StylelintLanguageServer implements Disposable {
    #private;
    /**
     * Creates a new Stylelint language server.
     */
    constructor({ connection, logger, modules }: LanguageServerConstructorParameters);
    /**
     * Starts the language server.
     */
    start(): void;
    /**
     * Disposes the language server.
     */
    dispose(): void;
}
