"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _StylelintResolver_instances, _StylelintResolver_connection, _StylelintResolver_logger, _StylelintResolver_globalPathResolver, _StylelintResolver_logError, _StylelintResolver_findPnPLoader, _StylelintResolver_requirePnP, _StylelintResolver_requireNode, _StylelintResolver_getRequirePath, _StylelintResolver_resolveFromPath, _StylelintResolver_resolveFromModules;
Object.defineProperty(exports, "__esModule", { value: true });
exports.StylelintResolver = void 0;
const promises_1 = __importDefault(require("fs/promises"));
const module_1 = require("module");
const path_1 = __importDefault(require("path"));
const process_1 = __importDefault(require("process"));
const node_1 = require("vscode-languageserver/node");
const vscode_uri_1 = require("vscode-uri");
const index_1 = require("../documents/index");
const find_package_root_1 = require("./find-package-root");
const global_path_resolver_1 = require("./global-path-resolver");
const index_2 = require("../functions/index");
/**
 * Utility for resolving the path to the Stylelint package. Each instance caches
 * resolved paths to global `node_modules` directories.
 */
class StylelintResolver {
    /**
     * @param connection The language server connection.
     * @param logger The logger to use.
     */
    constructor(connection, logger) {
        _StylelintResolver_instances.add(this);
        /**
         * The language server connection.
         */
        _StylelintResolver_connection.set(this, void 0);
        /**
         * The logger to use, if any.
         */
        _StylelintResolver_logger.set(this, void 0);
        /**
         * The global path resolver.
         */
        _StylelintResolver_globalPathResolver.set(this, void 0);
        __classPrivateFieldSet(this, _StylelintResolver_connection, connection, "f");
        __classPrivateFieldSet(this, _StylelintResolver_logger, logger, "f");
        __classPrivateFieldSet(this, _StylelintResolver_globalPathResolver, new global_path_resolver_1.GlobalPathResolver(logger), "f");
    }
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
    async resolve({ packageManager, stylelintPath }, textDocument) {
        const getWorkspaceFolderFn = (0, index_2.lazyCallAsync)(async () => __classPrivateFieldGet(this, _StylelintResolver_connection, "f") && (await (0, index_1.getWorkspaceFolder)(__classPrivateFieldGet(this, _StylelintResolver_connection, "f"), textDocument)));
        const stylelint = await (0, index_2.getFirstResolvedValue)(() => __classPrivateFieldGet(this, _StylelintResolver_instances, "m", _StylelintResolver_resolveFromPath).call(this, stylelintPath, getWorkspaceFolderFn), () => __classPrivateFieldGet(this, _StylelintResolver_instances, "m", _StylelintResolver_resolveFromModules).call(this, textDocument, getWorkspaceFolderFn, packageManager));
        if (!stylelint) {
            __classPrivateFieldGet(this, _StylelintResolver_logger, "f")?.warn('Failed to load Stylelint either globally or from the current workspace.');
            return undefined;
        }
        return stylelint;
    }
}
exports.StylelintResolver = StylelintResolver;
_StylelintResolver_connection = new WeakMap(), _StylelintResolver_logger = new WeakMap(), _StylelintResolver_globalPathResolver = new WeakMap(), _StylelintResolver_instances = new WeakSet(), _StylelintResolver_logError = function _StylelintResolver_logError(message, error) {
    if (__classPrivateFieldGet(this, _StylelintResolver_logger, "f")) {
        __classPrivateFieldGet(this, _StylelintResolver_logger, "f")?.error(message, error && { error });
    }
    if (__classPrivateFieldGet(this, _StylelintResolver_connection, "f")) {
        __classPrivateFieldGet(this, _StylelintResolver_connection, "f").window.showErrorMessage(`Stylelint: ${message}`);
    }
}, _StylelintResolver_findPnPLoader = 
/**
 * Tries to find the PnP loader in the given directory. If the loader cannot
 * be found, `undefined` will be returned.
 */
async function _StylelintResolver_findPnPLoader(directory) {
    const pnpFilenames = ['.pnp.cjs', '.pnp.js'];
    for (const filename of pnpFilenames) {
        const pnpPath = path_1.default.join(directory, filename);
        try {
            if ((await promises_1.default.stat(pnpPath)).isFile()) {
                return pnpPath;
            }
        }
        catch (error) {
            __classPrivateFieldGet(this, _StylelintResolver_logger, "f")?.debug('Did not find PnP loader at tested path', { path: pnpPath, error });
        }
    }
    __classPrivateFieldGet(this, _StylelintResolver_logger, "f")?.debug('Could not find a PnP loader', { path: directory });
    return undefined;
}, _StylelintResolver_requirePnP = 
/**
 * Tries to resolve the Stylelint package using Plug-n-Play. If the package
 * cannot be resolved, `undefined` will be returned.
 */
async function _StylelintResolver_requirePnP(cwd) {
    if (!cwd) {
        return undefined;
    }
    const root = await (0, find_package_root_1.findPackageRoot)(cwd, 'yarn.lock');
    if (!root) {
        __classPrivateFieldGet(this, _StylelintResolver_logger, "f")?.debug('Could not find a Yarn lockfile', { cwd });
        return undefined;
    }
    const pnpPath = await __classPrivateFieldGet(this, _StylelintResolver_instances, "m", _StylelintResolver_findPnPLoader).call(this, root);
    if (!pnpPath) {
        return undefined;
    }
    if (!process_1.default.versions.pnp) {
        try {
            // eslint-disable-next-line @typescript-eslint/no-require-imports
            require(pnpPath).setup();
        }
        catch (error) {
            __classPrivateFieldGet(this, _StylelintResolver_logger, "f")?.warn('Could not setup PnP', { path: pnpPath, error });
            return undefined;
        }
    }
    try {
        const rootRelativeRequire = (0, module_1.createRequire)(pnpPath);
        const stylelintEntryPath = rootRelativeRequire.resolve('stylelint');
        const stylelintPath = await (0, find_package_root_1.findPackageRoot)(stylelintEntryPath);
        if (!stylelintPath) {
            __classPrivateFieldGet(this, _StylelintResolver_logger, "f")?.warn('Failed to find the Stylelint package root', {
                path: stylelintEntryPath,
            });
            return undefined;
        }
        const stylelint = rootRelativeRequire('stylelint');
        const result = {
            stylelint,
            resolvedPath: stylelintPath,
        };
        __classPrivateFieldGet(this, _StylelintResolver_logger, "f")?.debug('Resolved Stylelint using PnP', {
            path: pnpPath,
        });
        return result;
    }
    catch (error) {
        __classPrivateFieldGet(this, _StylelintResolver_logger, "f")?.warn('Could not load Stylelint using PnP', { path: root, error });
        return undefined;
    }
}, _StylelintResolver_requireNode = 
/**
 * Tries to resolve the Stylelint package from `node_modules`. If the
 * package cannot be resolved, `undefined` will be returned.
 */
async function _StylelintResolver_requireNode(cwd, globalModulesPath, trace) {
    try {
        const stylelintPath = await node_1.Files.resolve('stylelint', globalModulesPath, cwd, trace);
        const result = {
            // eslint-disable-next-line @typescript-eslint/no-require-imports
            stylelint: require(stylelintPath),
            resolvedPath: stylelintPath,
        };
        __classPrivateFieldGet(this, _StylelintResolver_logger, "f")?.debug('Resolved Stylelint from node_modules', {
            path: stylelintPath,
        });
        return result;
    }
    catch (error) {
        __classPrivateFieldGet(this, _StylelintResolver_logger, "f")?.warn('Could not load Stylelint from node_modules', { error });
        return undefined;
    }
}, _StylelintResolver_getRequirePath = 
/**
 * If the given path is absolute, returns it. Otherwise, if a connection is
 * available, returns the path resolved to the document's workspace folder.
 * If no connection is available, returns the path as-is.
 */
async function _StylelintResolver_getRequirePath(stylelintPath, getWorkspaceFolderFn) {
    if (!__classPrivateFieldGet(this, _StylelintResolver_connection, "f") || path_1.default.isAbsolute(stylelintPath)) {
        return stylelintPath;
    }
    const workspaceFolder = await getWorkspaceFolderFn();
    return workspaceFolder ? path_1.default.join(workspaceFolder, stylelintPath) : stylelintPath;
}, _StylelintResolver_resolveFromPath = 
/**
 * Attempts to resolve the Stylelint package from a path. If an error
 * occurs, it will be logged through the connection and thrown. If the
 * resolved module does not have a lint function, an error will be logged
 * and `undefined` will be returned.
 */
async function _StylelintResolver_resolveFromPath(stylelintPath, getWorkspaceFolderFn) {
    if (!stylelintPath) {
        return undefined;
    }
    const errorMessage = `Failed to load Stylelint from "stylelintPath": ${stylelintPath}.`;
    try {
        const requirePath = await __classPrivateFieldGet(this, _StylelintResolver_instances, "m", _StylelintResolver_getRequirePath).call(this, stylelintPath, getWorkspaceFolderFn);
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const stylelint = require(requirePath);
        if (stylelint && typeof stylelint.lint === 'function') {
            return {
                stylelint,
                resolvedPath: requirePath,
            };
        }
    }
    catch (err) {
        __classPrivateFieldGet(this, _StylelintResolver_instances, "m", _StylelintResolver_logError).call(this, errorMessage, err);
        throw err;
    }
    __classPrivateFieldGet(this, _StylelintResolver_instances, "m", _StylelintResolver_logError).call(this, errorMessage);
    return undefined;
}, _StylelintResolver_resolveFromModules = 
/**
 * Attempts to resolve the Stylelint package from the given document's
 * workspace folder or the global `node_modules` directory for the given
 * package manager. Resolution will be traced through the connection.
 *
 * If a path cannot be resolved, `undefined` will be returned. If the
 * resolved module does not have a lint function, an error will be logged
 * and `undefined` will be returned.
 */
async function _StylelintResolver_resolveFromModules(textDocument, getWorkspaceFolderFn, packageManager) {
    const connection = __classPrivateFieldGet(this, _StylelintResolver_connection, "f");
    try {
        const globalModulesPath = packageManager
            ? await __classPrivateFieldGet(this, _StylelintResolver_globalPathResolver, "f").resolve(packageManager)
            : undefined;
        const documentURI = vscode_uri_1.URI.parse(textDocument.uri);
        const cwd = documentURI.scheme === 'file'
            ? path_1.default.dirname(documentURI.fsPath)
            : await getWorkspaceFolderFn();
        const result = await (0, index_2.getFirstResolvedValue)(async () => await __classPrivateFieldGet(this, _StylelintResolver_instances, "m", _StylelintResolver_requirePnP).call(this, cwd), async () => await __classPrivateFieldGet(this, _StylelintResolver_instances, "m", _StylelintResolver_requireNode).call(this, cwd, globalModulesPath, (message, verbose) => {
            __classPrivateFieldGet(this, _StylelintResolver_logger, "f")?.debug(message.replace(/\n/g, '  '), { verbose });
            connection?.tracer.log(message, verbose);
        }));
        if (!result) {
            return undefined;
        }
        if (typeof result.stylelint?.lint !== 'function') {
            __classPrivateFieldGet(this, _StylelintResolver_instances, "m", _StylelintResolver_logError).call(this, 'stylelint.lint is not a function.');
            return undefined;
        }
        return result;
    }
    catch (error) {
        __classPrivateFieldGet(this, _StylelintResolver_logger, "f")?.debug('Failed to resolve Stylelint from workspace or globally-installed packages.', { error });
    }
    return undefined;
};
//# sourceMappingURL=stylelint-resolver.js.map