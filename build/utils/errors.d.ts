/**
 * Takes an object with errors, returning a new object in which each error has
 * been replaced by a serializable object with the error's properties. Iterables
 * that aren't arrays, maps, or sets are converted to arrays.
 * @param object The object with errors.
 * @returns The object with each error replaced by a serializable object.
 */
export declare function serializeErrors<T, R extends {
    [K in keyof T]: T[K];
}>(object: T): R;
