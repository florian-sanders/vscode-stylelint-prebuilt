"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isIterable = isIterable;
exports.isIterableObject = isIterableObject;
/**
 * Checks if the given value is iterable.
 */
function isIterable(obj) {
    return (obj !== null &&
        obj !== undefined &&
        typeof obj[Symbol.iterator] === 'function');
}
/**
 * Checks if the given value is an iterable object.
 */
function isIterableObject(obj) {
    return isIterable(obj) && typeof obj === 'object';
}
//# sourceMappingURL=iterables.js.map