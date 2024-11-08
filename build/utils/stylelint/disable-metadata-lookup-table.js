"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _DisableMetadataLookupTable_instances, _DisableMetadataLookupTable_reportsByType, _DisableMetadataLookupTable_reportsByRule, _DisableMetadataLookupTable_reportsByRange, _DisableMetadataLookupTable_getRangeKey;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DisableMetadataLookupTable = void 0;
const sets_1 = require("../sets");
const get_disable_diagnostic_rule_1 = require("./get-disable-diagnostic-rule");
/**
 * Helps lookup disable reports by type, rule, or range.
 */
class DisableMetadataLookupTable {
    /**
     * @param diagnostics The diagnostics to build the lookup table from.
     */
    constructor(diagnostics) {
        _DisableMetadataLookupTable_instances.add(this);
        /**
         * Reports by type.
         */
        _DisableMetadataLookupTable_reportsByType.set(this, new Map());
        /**
         * Reports by type.
         */
        _DisableMetadataLookupTable_reportsByRule.set(this, new Map());
        /**
         * Reports by type.
         */
        _DisableMetadataLookupTable_reportsByRange.set(this, new Map());
        for (const diagnostic of diagnostics) {
            const rule = (0, get_disable_diagnostic_rule_1.getDisableDiagnosticRule)(diagnostic);
            if (!rule) {
                continue;
            }
            // If getDisableDiagnosticRule returns a rule, the diagnostic code
            // must be a string.
            const code = diagnostic.code;
            const existingByType = __classPrivateFieldGet(this, _DisableMetadataLookupTable_reportsByType, "f").get(code);
            if (existingByType) {
                existingByType.add(diagnostic);
            }
            else {
                __classPrivateFieldGet(this, _DisableMetadataLookupTable_reportsByType, "f").set(code, new Set([diagnostic]));
            }
            const existingByRule = __classPrivateFieldGet(this, _DisableMetadataLookupTable_reportsByRule, "f").get(rule);
            if (existingByRule) {
                existingByRule.add(diagnostic);
            }
            else {
                __classPrivateFieldGet(this, _DisableMetadataLookupTable_reportsByRule, "f").set(rule, new Set([diagnostic]));
            }
            const rangeKey = __classPrivateFieldGet(this, _DisableMetadataLookupTable_instances, "m", _DisableMetadataLookupTable_getRangeKey).call(this, diagnostic.range);
            const existingByRange = __classPrivateFieldGet(this, _DisableMetadataLookupTable_reportsByRange, "f").get(rangeKey);
            if (existingByRange) {
                existingByRange.add(diagnostic);
            }
            else {
                __classPrivateFieldGet(this, _DisableMetadataLookupTable_reportsByRange, "f").set(rangeKey, new Set([diagnostic]));
            }
        }
    }
    /**
     * Finds the reports that match the given type, rule, and range.
     */
    find({ type, rule, range, }) {
        const reportsByType = type ? __classPrivateFieldGet(this, _DisableMetadataLookupTable_reportsByType, "f").get(type) : undefined;
        const reportsByRule = rule ? __classPrivateFieldGet(this, _DisableMetadataLookupTable_reportsByRule, "f").get(rule) : undefined;
        const reportsByRange = range ? __classPrivateFieldGet(this, _DisableMetadataLookupTable_reportsByRange, "f").get(__classPrivateFieldGet(this, _DisableMetadataLookupTable_instances, "m", _DisableMetadataLookupTable_getRangeKey).call(this, range)) : undefined;
        return (0, sets_1.intersect)((0, sets_1.intersect)(reportsByType, reportsByRule), reportsByRange) ?? new Set();
    }
}
exports.DisableMetadataLookupTable = DisableMetadataLookupTable;
_DisableMetadataLookupTable_reportsByType = new WeakMap(), _DisableMetadataLookupTable_reportsByRule = new WeakMap(), _DisableMetadataLookupTable_reportsByRange = new WeakMap(), _DisableMetadataLookupTable_instances = new WeakSet(), _DisableMetadataLookupTable_getRangeKey = function _DisableMetadataLookupTable_getRangeKey({ start, end }) {
    return `${start.line}:${start.character}:${end.line}:${end.character}`;
};
//# sourceMappingURL=disable-metadata-lookup-table.js.map