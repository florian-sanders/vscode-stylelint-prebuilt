import { Diagnostic } from 'vscode-languageserver-types';
import type stylelint from 'stylelint';
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
export declare function warningToDiagnostic(warning: stylelint.Warning, ruleMetadata?: stylelint.LinterResult['ruleMetadata']): Diagnostic;
