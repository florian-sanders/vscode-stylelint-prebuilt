"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDisableReportRule = isDisableReportRule;
const types_1 = require("./types");
/**
 * Returns whether or not the given rule is a disable report rule.
 * @param rule The rule to check.
 */
function isDisableReportRule(rule) {
    switch (rule) {
        case types_1.DisableReportRuleNames.Descriptionless:
        case types_1.DisableReportRuleNames.Illegal:
        case types_1.DisableReportRuleNames.InvalidScope:
        case types_1.DisableReportRuleNames.Needless:
            return true;
        default:
            return false;
    }
}
//# sourceMappingURL=is-disable-report-rule.js.map