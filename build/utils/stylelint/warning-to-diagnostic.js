"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.warningToDiagnostic = warningToDiagnostic;
const vscode_languageserver_types_1 = require("vscode-languageserver-types");
/**
 * Converts a Stylelint warning to an LSP Diagnostic.
 *
 * @example
 * ```js
 * const [result] = await stylelint.lint({
 *   code: 'a { color: red; }',
 *   config: { rules: { 'color-named': 'never' } }
 * });
 *
 * const [warning] = result.warnings;
 * // {
 * //   rule: 'color-named',
 * //   text: 'Unexpected named color "red" (color-named)',
 * //   severity: 'error',
 * //   line: 1,
 * //   column: 12
 * // }
 *
 * const diagnostic = warningToDiagnostic(warning);
 * // {
 * //   message: 'Unexpected named color "red" (color-named)',
 * //   severity: 1,
 * //   source: 'Stylelint',
 * //   range: {
 * //     start: {
 * //       line: 0,
 * //       character: 11
 * //     },
 * //     end: {
 * //       line: 0,
 * //       character: 11
 * //     }
 * //   }
 * // }
 * ```
 * @param warning The warning to convert.
 * @param rules Available Stylelint rules.
 */
function warningToDiagnostic(warning, ruleMetadata) {
    const start = vscode_languageserver_types_1.Position.create(warning.line - 1, warning.column - 1);
    const end = typeof warning.endLine === 'number' && typeof warning.endColumn === 'number'
        ? vscode_languageserver_types_1.Position.create(warning.endLine - 1, warning.endColumn - 1)
        : vscode_languageserver_types_1.Position.create(warning.line - 1, warning.column);
    const ruleDocUrl = ruleMetadata?.[warning.rule]?.url;
    const diagnostic = vscode_languageserver_types_1.Diagnostic.create(vscode_languageserver_types_1.Range.create(start, end), warning.text, vscode_languageserver_types_1.DiagnosticSeverity[warning.severity === 'warning' ? 'Warning' : 'Error'], warning.rule, 'Stylelint');
    if (ruleDocUrl) {
        diagnostic.codeDescription = { href: ruleDocUrl };
    }
    return diagnostic;
}
//# sourceMappingURL=warning-to-diagnostic.js.map