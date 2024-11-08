import type { TextDocument } from 'vscode-languageserver-textdocument';
import * as LSP from 'vscode-languageserver-protocol';
/**
 * Creates a code action that disables a rule for a particular line.
 * @param document The document to apply the code action to.
 * @param diagnostic The diagnostic corresponding to the rule to disable.
 * @param location Whether to disable the rule on the line containing the
 * diagnostic or on the line before the diagnostic.
 */
export declare function createDisableRuleLineCodeAction(document: TextDocument, { code, range }: LSP.Diagnostic, location: 'sameLine' | 'separateLine'): LSP.CodeAction;
