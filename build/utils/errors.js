"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serializeErrors = serializeErrors;
const serialize_error_1 = require("serialize-error");
const iterables_1 = require("./iterables");
const index_1 = require("./objects/index");
/**
 * Takes an object with errors, returning a new object in which each error has
 * been replaced by a serializable object with the error's properties. Iterables
 * that aren't arrays, maps, or sets are converted to arrays.
 * @param object The object with errors.
 * @returns The object with each error replaced by a serializable object.
 */
function serializeErrors(object) {
    /**
     * @param obj The object with errors.
     * @param visited The set of objects that have already been visited.
     * @returns The object with each error replaced by a serializable object.
     */
    const serializeInner = (obj, visited) => {
        if (!obj || typeof obj !== 'object') {
            return obj;
        }
        if (visited.has(obj)) {
            return visited.get(obj);
        }
        if (obj instanceof Error) {
            const result = (0, serialize_error_1.serializeError)(obj);
            visited.set(obj, result);
            return result;
        }
        if (obj instanceof Map) {
            const result = new Map();
            visited.set(obj, result);
            for (const [key, value] of obj) {
                const serializedKey = serializeInner(key, visited);
                const serializedValue = serializeInner(value, visited);
                if ((0, index_1.isObject)(key)) {
                    visited.set(key, serializedKey);
                }
                if ((0, index_1.isObject)(value)) {
                    visited.set(value, serializedValue);
                }
                result.set(serializedKey, serializedValue);
            }
            return result;
        }
        if (obj instanceof Set) {
            const result = new Set();
            visited.set(obj, result);
            for (const value of obj) {
                if (!(0, index_1.isObject)(value)) {
                    result.add(value);
                    continue;
                }
                const serializedValue = serializeInner(value, visited);
                visited.set(value, serializedValue);
                result.add(serializedValue);
            }
            return result;
        }
        if ((0, iterables_1.isIterable)(obj)) {
            const result = [];
            visited.set(obj, result);
            for (const value of obj) {
                result.push(serializeInner(value, visited));
            }
            return result;
        }
        visited.set(obj, '[Circular]');
        const serializedObj = Object.fromEntries(Object.entries(obj).map(([key, value]) => {
            if (!(0, index_1.isObject)(value)) {
                return [key, value];
            }
            if (visited.has(value)) {
                return [key, visited.get(value)];
            }
            if (value instanceof Error) {
                const serialized = (0, serialize_error_1.serializeError)(value);
                visited.set(value, serialized);
                return [key, serialized];
            }
            const result = serializeInner(value, visited);
            visited.set(value, result);
            return [key, result];
        }));
        visited.set(obj, serializedObj);
        return serializedObj;
    };
    return serializeInner(object, new WeakMap());
}
//# sourceMappingURL=errors.js.map