/**
 * Merges options with default values and returns a new object. Nested objects
 * are also merged. Properties not present in the defaults are not copied.
 */
export declare function mergeOptionsWithDefaults<T extends object>(options: unknown, defaults: T): T;
