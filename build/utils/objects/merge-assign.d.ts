/**
 * Copies all enumerable properties from one or two source objects to a target
 * object, recursing for nested objects. Merges arrays by concatenating them.
 * @param target The target object to assign to.
 * @param source1 The first source object from which to copy properties.
 * @param source2 The second source object from which to copy properties.
 */
export declare function mergeAssign<T extends object, U extends object, V extends object>(target: T, source1: U | undefined, source2?: V): T & U & V;
