import type { TextDocument } from 'vscode-languageserver-textdocument';
import * as LSP from 'vscode-languageserver-protocol';
/**
 * Creates a code action that disables a rule for an entire file.
 * @param document The document to apply the code action to.
 * @param diagnostic The diagnostic corresponding to the rule to disable.
 */
export declare function createDisableRuleFileCodeAction(document: TextDocument, { code }: LSP.Diagnostic): LSP.CodeAction;
