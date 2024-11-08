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
var _GlobalPathResolver_instances, _GlobalPathResolver_logger, _GlobalPathResolver_cache, _GlobalPathResolver_isWindows, _GlobalPathResolver_resolvers, _GlobalPathResolver_yarn, _GlobalPathResolver_npm, _GlobalPathResolver_pnpm;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalPathResolver = void 0;
const os_1 = __importDefault(require("os"));
const path_1 = __importDefault(require("path"));
const processes_1 = require("../processes");
/**
 * Resolves the global `node_modules` path for different package managers.
 */
class GlobalPathResolver {
    /**
     * Instantiates a new global path resolver.
     * @param logger The logger to use for tracing resolution.
     */
    constructor(logger) {
        _GlobalPathResolver_instances.add(this);
        /**
         * The logger to use for tracing resolution.
         */
        _GlobalPathResolver_logger.set(this, void 0);
        /**
         * The cache of resolved paths.
         */
        _GlobalPathResolver_cache.set(this, {
            yarn: undefined,
            npm: undefined,
            pnpm: undefined,
        });
        /**
         * Whether or not the current platform is Windows.
         */
        _GlobalPathResolver_isWindows.set(this, void 0);
        /**
         * The resolvers by package manager.
         */
        _GlobalPathResolver_resolvers.set(this, {
            yarn: __classPrivateFieldGet(this, _GlobalPathResolver_instances, "m", _GlobalPathResolver_yarn).bind(this),
            npm: __classPrivateFieldGet(this, _GlobalPathResolver_instances, "m", _GlobalPathResolver_npm).bind(this),
            pnpm: __classPrivateFieldGet(this, _GlobalPathResolver_instances, "m", _GlobalPathResolver_pnpm).bind(this),
        });
        __classPrivateFieldSet(this, _GlobalPathResolver_logger, logger, "f");
        __classPrivateFieldSet(this, _GlobalPathResolver_isWindows, os_1.default.platform() === 'win32', "f");
    }
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
    async resolve(packageManager) {
        const cached = __classPrivateFieldGet(this, _GlobalPathResolver_cache, "f")[packageManager];
        if (cached) {
            return cached;
        }
        const resolver = __classPrivateFieldGet(this, _GlobalPathResolver_resolvers, "f")[packageManager];
        if (!resolver) {
            __classPrivateFieldGet(this, _GlobalPathResolver_logger, "f")?.warn('Unsupported package manager.', { packageManager });
            return undefined;
        }
        try {
            const globalPath = await resolver();
            if (globalPath) {
                __classPrivateFieldGet(this, _GlobalPathResolver_cache, "f")[packageManager] = globalPath;
            }
            return globalPath;
        }
        catch (error) {
            __classPrivateFieldGet(this, _GlobalPathResolver_logger, "f")?.warn('Failed to resolve global node_modules path.', { packageManager, error });
            return undefined;
        }
    }
}
exports.GlobalPathResolver = GlobalPathResolver;
_GlobalPathResolver_logger = new WeakMap(), _GlobalPathResolver_cache = new WeakMap(), _GlobalPathResolver_isWindows = new WeakMap(), _GlobalPathResolver_resolvers = new WeakMap(), _GlobalPathResolver_instances = new WeakSet(), _GlobalPathResolver_yarn = 
/**
 * Resolves the global `node_modules` path for Yarn.
 *
 * Note: Only Yarn 1.x is supported. Yarn 2.x and higher have removed
 * support for globally installed packages.
 */
async function _GlobalPathResolver_yarn() {
    const tryParseLog = (line) => {
        try {
            return JSON.parse(line);
        }
        catch {
            return undefined;
        }
    };
    const yarnGlobalPath = await (0, processes_1.runProcessFindLine)('yarn', ['global', 'dir', '--json'], __classPrivateFieldGet(this, _GlobalPathResolver_isWindows, "f") ? { shell: true } : undefined, (line) => {
        const log = tryParseLog(line);
        if (!log || log.type !== 'log' || !log.data) {
            return undefined;
        }
        const globalPath = path_1.default.join(log.data, 'node_modules');
        __classPrivateFieldGet(this, _GlobalPathResolver_logger, "f")?.debug('Yarn returned global node_modules path.', { path: globalPath });
        return globalPath;
    });
    if (!yarnGlobalPath) {
        __classPrivateFieldGet(this, _GlobalPathResolver_logger, "f")?.warn('"yarn global dir --json" did not return a path.');
        return undefined;
    }
    return yarnGlobalPath;
}, _GlobalPathResolver_npm = 
/**
 * Resolves the global `node_modules` path for npm.
 */
async function _GlobalPathResolver_npm() {
    const npmGlobalPath = await (0, processes_1.runProcessFindLine)('npm', ['config', 'get', 'prefix'], __classPrivateFieldGet(this, _GlobalPathResolver_isWindows, "f") ? { shell: true } : undefined, (line) => {
        const trimmed = line.trim();
        if (!trimmed) {
            return undefined;
        }
        const globalPath = __classPrivateFieldGet(this, _GlobalPathResolver_isWindows, "f")
            ? path_1.default.join(trimmed, 'node_modules')
            : path_1.default.join(trimmed, 'lib/node_modules');
        __classPrivateFieldGet(this, _GlobalPathResolver_logger, "f")?.debug('npm returned global node_modules path.', { path: globalPath });
        return globalPath;
    });
    if (!npmGlobalPath) {
        __classPrivateFieldGet(this, _GlobalPathResolver_logger, "f")?.warn('"npm config get prefix" did not return a path.');
        return undefined;
    }
    return npmGlobalPath;
}, _GlobalPathResolver_pnpm = 
/**
 * Resolves the global `node_modules` path for pnpm.
 */
async function _GlobalPathResolver_pnpm() {
    const pnpmGlobalPath = await (0, processes_1.runProcessFindLine)('pnpm', ['root', '-g'], __classPrivateFieldGet(this, _GlobalPathResolver_isWindows, "f") ? { shell: true } : undefined, (line) => {
        const trimmed = line.trim();
        if (!trimmed) {
            return undefined;
        }
        __classPrivateFieldGet(this, _GlobalPathResolver_logger, "f")?.debug('pnpm returned global node_modules path.', { path: trimmed });
        return trimmed;
    });
    if (!pnpmGlobalPath) {
        __classPrivateFieldGet(this, _GlobalPathResolver_logger, "f")?.warn('"pnpm root -g" did not return a path.');
        return undefined;
    }
    return pnpmGlobalPath;
};
//# sourceMappingURL=global-path-resolver.js.map