import type winston from 'winston';
import { PackageManager } from './types';
/**
 * Resolves the global `node_modules` path for different package managers.
 */
export declare class GlobalPathResolver {
    #private;
    /**
     * Instantiates a new global path resolver.
     * @param logger The logger to use for tracing resolution.
     */
    constructor(logger?: winston.Logger);
    /**
     * Attempts to resolve the global `node_modules` path for the given package
     * manager.
     *
     * On a successful resolution, the method returns a promise that resolves to the
     * package manager's global `node_modules` path. Paths are cached in the
     * resolver on the first successful resolution.
     *
     * When a path cannot be resolved, the promise resolves to `undefined`.
     *
     * @example
     * ```js
     * const resolver = getGlobalPathResolver();
     * const yarnGlobalPath = await resolver.resolve(
     *   'yarn',
     *   message => connection && connection.tracer.log(message)
     * );
     * ```
     * @param packageManager The package manager to resolve the path for.
     */
    resolve(packageManager: PackageManager): Promise<string | undefined>;
}
