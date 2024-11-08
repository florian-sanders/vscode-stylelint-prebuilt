import { DisableReportRuleNames } from './types';
/**
 * Returns whether or not the given rule is a disable report rule.
 * @param rule The rule to check.
 */
export declare function isDisableReportRule(rule: unknown): rule is DisableReportRuleNames;
