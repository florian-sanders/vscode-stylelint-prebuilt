import type LSP from 'vscode-languageserver-protocol';
import type { LanguageServerModuleConstructorParameters, LanguageServerModule } from '../types';
export declare class ValidatorModule implements LanguageServerModule {
    #private;
    static id: string;
    constructor({ context, logger }: LanguageServerModuleConstructorParameters);
    dispose(): void;
    getDiagnostics(uri: string): LSP.Diagnostic[];
    onInitialize(): void;
    onDidRegisterHandlers(): void;
    onDidChangeConfiguration(): Promise<void>;
}
