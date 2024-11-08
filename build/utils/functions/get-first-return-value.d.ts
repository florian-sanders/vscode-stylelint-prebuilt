/**
 * Runs each function, passing the result of the first function return
 * a value that is not `undefined`. Any subsequent functions are not run.
 */
export declare function getFirstReturnValue<V>(...functions: (() => V)[]): V | undefined;
/**
 * Runs each async function, passing the resolved value of the first function
 * that resolves to a value that is not `undefined`. Any subsequent functions
 * are not run.
 */
export declare function getFirstResolvedValue<V>(...functions: (() => Promise<V>)[]): Promise<V | undefined>;
