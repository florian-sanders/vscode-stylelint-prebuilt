"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _RuleCodeActionsCollection_actions;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RuleCodeActionsCollection = void 0;
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
class RuleCodeActionsCollection {
    constructor() {
        /**
         * The code actions, keyed by their rule.
         */
        _RuleCodeActionsCollection_actions.set(this, new Map());
    }
    /**
     * Gets the code actions for a rule.
     */
    get(ruleId) {
        const existing = __classPrivateFieldGet(this, _RuleCodeActionsCollection_actions, "f").get(ruleId);
        if (existing) {
            return existing;
        }
        const actions = {};
        __classPrivateFieldGet(this, _RuleCodeActionsCollection_actions, "f").set(ruleId, actions);
        return actions;
    }
    /**
     * Iterates over the code actions, grouped by rule and sorted by the
     * priority of the rule.
     */
    *[(_RuleCodeActionsCollection_actions = new WeakMap(), Symbol.iterator)]() {
        for (const actions of __classPrivateFieldGet(this, _RuleCodeActionsCollection_actions, "f").values()) {
            if (actions.disableLine) {
                yield actions.disableLine;
            }
            if (actions.disableFile) {
                yield actions.disableFile;
            }
            if (actions.documentation) {
                yield actions.documentation;
            }
        }
    }
    /**
     * Gets the number of code actions.
     */
    get size() {
        const iterator = this[Symbol.iterator]();
        let size = 0;
        while (!iterator.next().done) {
            size++;
        }
        return size;
    }
}
exports.RuleCodeActionsCollection = RuleCodeActionsCollection;
//# sourceMappingURL=rule-code-actions-collection.js.map