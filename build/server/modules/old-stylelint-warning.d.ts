import type LSP from 'vscode-languageserver-protocol';
import type { LanguageServerModuleConstructorParameters, LanguageServerModule } from '../types';
export declare class OldStylelintWarningModule implements LanguageServerModule {
    #private;
    static id: string;
    constructor({ context, logger }: LanguageServerModuleConstructorParameters);
    dispose(): void;
    onInitialize({ capabilities }: LSP.InitializeParams): void;
    onDidRegisterHandlers(): void;
}
