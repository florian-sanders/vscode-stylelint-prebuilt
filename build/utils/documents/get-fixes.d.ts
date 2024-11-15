import type stylelint from 'stylelint';
import type { TextDocument, TextEdit } from 'vscode-languageserver-textdocument';
import type { StylelintRunner, RunnerOptions } from '../stylelint/index';
/**
 * Runs Stylelint and returns fix text edits for the given document.
 * @param runner The Stylelint runner.
 * @param document The document to get fixes for.
 * @param linterOptions Linter options to use.
 * @param runnerOptions The runner options.
 */
export declare function getFixes(runner: StylelintRunner, document: TextDocument, linterOptions?: stylelint.LinterOptions, runnerOptions?: RunnerOptions): Promise<TextEdit[]>;
