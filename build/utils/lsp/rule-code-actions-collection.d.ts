import type { CodeAction } from 'vscode-languageserver-protocol';
import type { RuleCodeActions } from './types';
/**
 * A collection of code actions that apply to specific rules. Allows adding
 * actions and retrieving them grouped by the rules to which they apply and
 * sorted by the priority of the rule.
 *
 * Actions are prioritized in the order:
 *
 * 1. Disable rule actions
 * 2. Show documentation actions
 */
export declare class RuleCodeActionsCollection implements Iterable<CodeAction> {
    #private;
    /**
     * Gets the code actions for a rule.
     */
    get(ruleId: string): RuleCodeActions;
    /**
     * Iterates over the code actions, grouped by rule and sorted by the
     * priority of the rule.
     */
    [Symbol.iterator](): IterableIterator<CodeAction>;
    /**
     * Gets the number of code actions.
     */
    get size(): number;
}
