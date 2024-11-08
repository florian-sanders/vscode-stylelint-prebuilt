import type { Connection } from 'vscode-languageserver';
import type { TextDocument } from 'vscode-languageserver-textdocument';
import type stylelint from 'stylelint';
import type winston from 'winston';
import { StylelintResolver } from '../packages/index';
import type { LintDiagnostics, RunnerOptions } from './types';
/**
 * Runs Stylelint in VS Code.
 */
export declare class StylelintRunner {
    #private;
    constructor(connection?: Connection, logger?: winston.Logger, resolver?: StylelintResolver);
    /**
     * Lints the given document using Stylelint. The linting result is then
     * converted to LSP diagnostics and returned.
     * @param document
     * @param linterOptions
     * @param extensionOptions
     */
    lintDocument(document: TextDocument, linterOptions?: stylelint.LinterOptions, runnerOptions?: RunnerOptions): Promise<LintDiagnostics>;
}
