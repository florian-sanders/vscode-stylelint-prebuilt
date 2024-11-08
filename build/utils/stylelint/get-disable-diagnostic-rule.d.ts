import type LSP from 'vscode-languageserver-protocol';
/**
 * Gets the rule name to which a disable diagnostic applies. Returns `undefined`
 * if the diagnostic is not a disable diagnostic.
 * @param diagnostic The diagnostic corresponding to the Stylelint warning.
 */
export declare function getDisableDiagnosticRule(diagnostic: LSP.Diagnostic): string | undefined;
