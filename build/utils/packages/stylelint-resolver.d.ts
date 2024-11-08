import type winston from 'winston';
import { Connection } from 'vscode-languageserver/node';
import type { TextDocument } from 'vscode-languageserver-textdocument';
import type { StylelintResolutionResult, ResolverOptions } from './types';
/**
 * Utility for resolving the path to the Stylelint package. Each instance caches
 * resolved paths to global `node_modules` directories.
 */
export declare class StylelintResolver {
    #private;
    /**
     * @param connection The language server connection.
     * @param logger The logger to use.
     */
    constructor(connection?: Connection, logger?: winston.Logger);
    /**
     * Attempts to resolve the `stylelint` package from the following locations,
     * in order:
     *
     * 1. `options.stylelintPath`, if provided.
     * 2. `node_modules` in the workspace folder of the given document.
     * 3. The global `node_modules` directory for the given package manager.
     *
     * If `options.stylelintPath` is provided, but the path to which it points
     * cannot be required, an error will be thrown. In all other cases of failed
     * resolution, `undefined` will be returned. Resolution fails if either the
     * path to the `stylelint` package cannot be resolved or if the resolved
     * module does not have a `lint` function.
     *
     * If a connection is available, errors will be logged through it and module
     * resolution through `node_modules` will be traced through it.
     * @param {ResolverOptions} options
     * @param {TextDocument} textDocument
     * @returns {Promise<StylelintResolutionResult | undefined>}
     */
    resolve({ packageManager, stylelintPath }: ResolverOptions, textDocument: TextDocument): Promise<StylelintResolutionResult | undefined>;
}
