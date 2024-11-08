"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isObject = isObject;
/**
 * Returns true if the value is a true object (i.e. not a primitive type).
 */
function isObject(value) {
    return typeof value === 'object' && value !== null;
}
//# sourceMappingURL=is-object.js.map