"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mergeOptionsWithDefaults = mergeOptionsWithDefaults;
const rfdc_1 = __importDefault(require("rfdc"));
const is_object_1 = require("./is-object");
const deepClone = (0, rfdc_1.default)();
/**
 * Merges options with default values and returns a new object. Nested objects
 * are also merged. Properties not present in the defaults are not copied.
 */
function mergeOptionsWithDefaultsInner(options, defaults, seen, mapped, 
// eslint-disable-next-line @typescript-eslint/no-explicit-any
circulars) {
    if (!(0, is_object_1.isObject)(options)) {
        return deepClone(defaults);
    }
    const result = {};
    for (const key of Object.keys(defaults)) {
        const fromDefaults = defaults[key];
        const fromOptions = options[key];
        if (fromOptions !== undefined) {
            if ((0, is_object_1.isObject)(fromOptions)) {
                if (seen.has(fromOptions)) {
                    circulars.add([fromOptions, result, key]);
                    continue;
                }
                seen.add(fromOptions);
                const value = Array.isArray(fromOptions)
                    ? fromOptions.map((item) => deepClone(item))
                    : (0, is_object_1.isObject)(fromDefaults) && !Array.isArray(fromDefaults)
                        ? mergeOptionsWithDefaultsInner(fromOptions, fromDefaults, seen, mapped, circulars)
                        : deepClone(fromOptions);
                mapped.set(fromOptions, value);
                result[key] = value;
                continue;
            }
            result[key] = fromOptions;
            continue;
        }
        result[key] = deepClone(fromDefaults);
    }
    return result;
}
/**
 * Merges options with default values and returns a new object. Nested objects
 * are also merged. Properties not present in the defaults are not copied.
 */
function mergeOptionsWithDefaults(options, defaults) {
    // Track references to avoid circular infinite recursion.
    const seen = new WeakSet();
    const mapped = new WeakMap();
    const circulars = new Set();
    const result = mergeOptionsWithDefaultsInner(options, defaults, seen, mapped, circulars);
    for (const [circular, obj, key] of circulars) {
        obj[key] = mapped.get(circular);
    }
    return result;
}
//# sourceMappingURL=merge-options-with-defaults.js.map