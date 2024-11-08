"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDisableDiagnosticRule = getDisableDiagnosticRule;
const types_1 = require("./types");
/**
 * Gets the rule name to which a disable diagnostic applies. Returns `undefined`
 * if the diagnostic is not a disable diagnostic.
 * @param diagnostic The diagnostic corresponding to the Stylelint warning.
 */
function getDisableDiagnosticRule(diagnostic) {
    switch (diagnostic.code) {
        case types_1.DisableReportRuleNames.Needless:
            return diagnostic.message.match(/^Needless disable for "(.+)"$/)?.[1];
        case types_1.DisableReportRuleNames.InvalidScope:
            return diagnostic.message.match(/^Rule "(.+)" isn't enabled$/)?.[1];
        case types_1.DisableReportRuleNames.Descriptionless:
            return diagnostic.message.match(/^Disable for "(.+)" is missing a description$/)?.[1];
        case types_1.DisableReportRuleNames.Illegal:
            return diagnostic.message.match(/^Rule "(.+)" may not be disabled$/)?.[1];
        default:
            return undefined;
    }
}
//# sourceMappingURL=get-disable-diagnostic-rule.js.map