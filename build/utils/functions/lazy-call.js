"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lazyCall = lazyCall;
exports.lazyCallAsync = lazyCallAsync;
/**
 * Creates a lazy-call function. The inner function will be called only the
 * first time the outer function is called. The inner function's return value
 * will be cached for the lifetime of the outer function.
 */
function lazyCall(inner) {
    let cached = false;
    let cache;
    return () => {
        if (!cached) {
            cache = inner();
            cached = true;
        }
        return cache;
    };
}
/**
 * Creates an async lazy-call function. The inner function will be called only
 * the first time the outer function is called. The inner function's resolved
 * value will be cached for the lifetime of the outer function.
 */
function lazyCallAsync(inner) {
    let cached = false;
    let cache;
    return async () => {
        if (!cached) {
            cache = await inner();
            cached = true;
        }
        return cache;
    };
}
//# sourceMappingURL=lazy-call.js.map