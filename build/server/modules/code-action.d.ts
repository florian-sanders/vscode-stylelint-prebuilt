import * as LSP from 'vscode-languageserver-protocol';
import type { LanguageServerModuleConstructorParameters, LanguageServerModule } from '../types';
export declare class CodeActionModule implements LanguageServerModule {
    #private;
    static id: string;
    constructor({ context, logger }: LanguageServerModuleConstructorParameters);
    dispose(): void;
    onInitialize(): Partial<LSP.InitializeResult>;
    onDidRegisterHandlers(): void;
}
