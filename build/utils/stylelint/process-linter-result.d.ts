import type stylelint from 'stylelint';
import { LintDiagnostics } from './types';
import { Stylelint } from './types';
/**
 * Processes the results of a Stylelint lint run.
 *
 * If Stylelint reported any warnings, they are converted to Diagnostics and
 * returned. If the lint results contain raw output in the `output` property, it
 * is also returned.
 *
 * Throws an `InvalidOptionError` for any invalid option warnings reported by
 * Stylelint.
 * @param stylelint The Stylelint instance that was used.
 * @param result The results returned by Stylelint.
 */
export declare function processLinterResult(stylelint: Stylelint, { results, output, ruleMetadata }: stylelint.LinterResult): LintDiagnostics;
