/**
 * Creates a lazy-call function. The inner function will be called only the
 * first time the outer function is called. The inner function's return value
 * will be cached for the lifetime of the outer function.
 */
export declare function lazyCall<R>(inner: () => R): () => R;
/**
 * Creates an async lazy-call function. The inner function will be called only
 * the first time the outer function is called. The inner function's resolved
 * value will be cached for the lifetime of the outer function.
 */
export declare function lazyCallAsync<R>(inner: () => Promise<R>): () => Promise<R>;
