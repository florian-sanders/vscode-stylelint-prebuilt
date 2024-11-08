import * as LSP from 'vscode-languageserver-protocol';
import type { LanguageServerModuleConstructorParameters, LanguageServerModule } from '../types';
export declare class FormatterModule implements LanguageServerModule {
    #private;
    static id: string;
    constructor({ context, logger }: LanguageServerModuleConstructorParameters);
    dispose(): void;
    onInitialize({ capabilities }: LSP.InitializeParams): Partial<LSP.InitializeResult>;
    onDidRegisterHandlers(): void;
}
