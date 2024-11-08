import type LSP from 'vscode-languageserver-protocol';
import type { LanguageServerModuleConstructorParameters, LanguageServerModule } from '../types';
export declare class AutoFixModule implements LanguageServerModule {
    #private;
    static id: string;
    constructor({ context, logger }: LanguageServerModuleConstructorParameters);
    onInitialize(): Partial<LSP.InitializeResult>;
    dispose(): void;
    onDidRegisterHandlers(): void;
}
