"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processLinterResult = processLinterResult;
const warning_to_diagnostic_1 = require("./warning-to-diagnostic");
const types_1 = require("./types");
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
function processLinterResult(stylelint, { results, output, ruleMetadata }) {
    if (results.length === 0) {
        return { diagnostics: [] };
    }
    const [{ invalidOptionWarnings, warnings, ignored }] = results;
    if (ignored) {
        return { diagnostics: [] };
    }
    if (invalidOptionWarnings.length !== 0) {
        throw new types_1.InvalidOptionError(invalidOptionWarnings);
    }
    if (!ruleMetadata) {
        // Create built-in rule metadata for backwards compatibility.
        ruleMetadata = new Proxy({}, {
            get: (_, key) => {
                return stylelint.rules?.[key]?.meta;
            },
        });
    }
    const diagnostics = warnings.map((warning) => (0, warning_to_diagnostic_1.warningToDiagnostic)(warning, ruleMetadata));
    return output ? { output: output, diagnostics } : { diagnostics };
}
//# sourceMappingURL=process-linter-result.js.map