"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mergeAssign = mergeAssign;
const is_object_1 = require("./is-object");
/**
 * Copies all enumerable properties from one or two source objects to a target
 * object, recursing for nested objects. Merges arrays by concatenating them.
 * @param target The target object to assign to.
 * @param source1 The first source object from which to copy properties.
 * @param source2 The second source object from which to copy properties.
 */
function mergeAssign(target, source1, source2) {
    const targetAsUnion = target;
    for (const object of [source1, source2]) {
        if (!object) {
            continue;
        }
        for (const key of Object.getOwnPropertyNames(object)) {
            if (key === '__proto__' || key === 'constructor') {
                continue;
            }
            const value = object[key];
            if ((0, is_object_1.isObject)(value)) {
                if (Array.isArray(value)) {
                    const existing = targetAsUnion[key];
                    targetAsUnion[key] = (Array.isArray(existing) ? existing.concat(value) : value);
                    continue;
                }
                if (!targetAsUnion[key]) {
                    targetAsUnion[key] = {};
                }
                targetAsUnion[key] = mergeAssign(targetAsUnion[key], value);
            }
            else {
                targetAsUnion[key] = value;
            }
        }
    }
    return targetAsUnion;
}
//# sourceMappingURL=merge-assign.js.map