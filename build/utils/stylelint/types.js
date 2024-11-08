"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidOptionError = exports.DisableReportRuleNames = void 0;
/**
 * Disable report rule names.
 */
var DisableReportRuleNames;
(function (DisableReportRuleNames) {
    DisableReportRuleNames["Needless"] = "--report-needless-disables";
    DisableReportRuleNames["InvalidScope"] = "--report-invalid-scope-disables";
    DisableReportRuleNames["Descriptionless"] = "--report-descriptionless-disables";
    DisableReportRuleNames["Illegal"] = "reportDisables";
})(DisableReportRuleNames || (exports.DisableReportRuleNames = DisableReportRuleNames = {}));
/**
 * Error thrown when a rule's option is invalid.
 */
class InvalidOptionError extends Error {
    constructor(warnings) {
        const reasons = warnings.map((warning) => warning.text);
        super(reasons.join('\n'));
        this.reasons = reasons;
    }
}
exports.InvalidOptionError = InvalidOptionError;
//# sourceMappingURL=types.js.map