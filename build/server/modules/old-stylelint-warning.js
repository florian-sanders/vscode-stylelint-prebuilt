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
var _OldStylelintWarningModule_instances, _OldStylelintWarningModule_context, _OldStylelintWarningModule_logger, _OldStylelintWarningModule_checkedWorkspaces, _OldStylelintWarningModule_openMigrationGuide, _OldStylelintWarningModule_disposables, _OldStylelintWarningModule_getStylelintVersion, _OldStylelintWarningModule_check;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OldStylelintWarningModule = void 0;
const path_1 = __importDefault(require("path"));
const promises_1 = __importDefault(require("fs/promises"));
const semver_1 = __importDefault(require("semver"));
const path_is_inside_1 = __importDefault(require("path-is-inside"));
const index_1 = require("../../utils/documents/index");
const index_2 = require("../../utils/packages/index");
class OldStylelintWarningModule {
    constructor({ context, logger }) {
        _OldStylelintWarningModule_instances.add(this);
        /**
         * The language server context.
         */
        _OldStylelintWarningModule_context.set(this, void 0);
        /**
         * The logger to use, if any.
         */
        _OldStylelintWarningModule_logger.set(this, void 0);
        /**
         * Set of workspaces for which Stylelint's version has already been checked.
         */
        _OldStylelintWarningModule_checkedWorkspaces.set(this, new Set());
        /**
         * Whether or not to provide the URL to the migration guide.
         */
        _OldStylelintWarningModule_openMigrationGuide.set(this, false);
        /**
         * Disposables for handlers.
         */
        _OldStylelintWarningModule_disposables.set(this, []);
        __classPrivateFieldSet(this, _OldStylelintWarningModule_context, context, "f");
        __classPrivateFieldSet(this, _OldStylelintWarningModule_logger, logger, "f");
    }
    dispose() {
        __classPrivateFieldGet(this, _OldStylelintWarningModule_disposables, "f").forEach((disposable) => disposable.dispose());
        __classPrivateFieldGet(this, _OldStylelintWarningModule_disposables, "f").length = 0;
    }
    onInitialize({ capabilities }) {
        __classPrivateFieldSet(this, _OldStylelintWarningModule_openMigrationGuide, capabilities.window?.showDocument?.support ?? false, "f");
    }
    onDidRegisterHandlers() {
        __classPrivateFieldGet(this, _OldStylelintWarningModule_logger, "f")?.debug('Registering onDidOpen handler');
        __classPrivateFieldGet(this, _OldStylelintWarningModule_disposables, "f").push(__classPrivateFieldGet(this, _OldStylelintWarningModule_context, "f").documents.onDidOpen(async ({ document }) => {
            const stylelintVersion = await __classPrivateFieldGet(this, _OldStylelintWarningModule_instances, "m", _OldStylelintWarningModule_check).call(this, document);
            if (!stylelintVersion) {
                return;
            }
            __classPrivateFieldGet(this, _OldStylelintWarningModule_logger, "f")?.warn(`Found unsupported version of Stylelint: ${stylelintVersion}`);
            const message = `Stylelint version ${stylelintVersion} is no longer supported. While it may continue to work for a while, you may encounter unexpected behavior. Please upgrade to version 14.0.0 or newer. See the migration guide for more information.`;
            if (!__classPrivateFieldGet(this, _OldStylelintWarningModule_openMigrationGuide, "f")) {
                __classPrivateFieldGet(this, _OldStylelintWarningModule_context, "f").connection.window.showWarningMessage(message);
                return;
            }
            const warningResponse = await __classPrivateFieldGet(this, _OldStylelintWarningModule_context, "f").connection.window.showWarningMessage(message, {
                title: 'Open migration guide',
            });
            if (warningResponse?.title === 'Open migration guide') {
                // Open URL in browser
                const showURIResponse = await __classPrivateFieldGet(this, _OldStylelintWarningModule_context, "f").connection.window.showDocument({
                    uri: 'https://github.com/stylelint/vscode-stylelint#migrating-from-vscode-stylelint-0xstylelint-13x',
                    external: true,
                });
                if (!showURIResponse.success) {
                    __classPrivateFieldGet(this, _OldStylelintWarningModule_logger, "f")?.warn('Failed to open migration guide');
                }
            }
        }));
        __classPrivateFieldGet(this, _OldStylelintWarningModule_logger, "f")?.debug('onDidOpen handler registered');
    }
}
exports.OldStylelintWarningModule = OldStylelintWarningModule;
_OldStylelintWarningModule_context = new WeakMap(), _OldStylelintWarningModule_logger = new WeakMap(), _OldStylelintWarningModule_checkedWorkspaces = new WeakMap(), _OldStylelintWarningModule_openMigrationGuide = new WeakMap(), _OldStylelintWarningModule_disposables = new WeakMap(), _OldStylelintWarningModule_instances = new WeakSet(), _OldStylelintWarningModule_getStylelintVersion = async function _OldStylelintWarningModule_getStylelintVersion(document, workspaceFolder) {
    const result = await __classPrivateFieldGet(this, _OldStylelintWarningModule_context, "f").resolveStylelint(document);
    if (!result) {
        __classPrivateFieldGet(this, _OldStylelintWarningModule_logger, "f")?.debug('Stylelint not found', {
            uri: document.uri,
        });
        return undefined;
    }
    const packageDir = await (0, index_2.findPackageRoot)(result.resolvedPath);
    if (!packageDir) {
        __classPrivateFieldGet(this, _OldStylelintWarningModule_logger, "f")?.debug('Stylelint package root not found', {
            uri: document.uri,
        });
        return undefined;
    }
    if (!(0, path_is_inside_1.default)(packageDir, workspaceFolder)) {
        __classPrivateFieldGet(this, _OldStylelintWarningModule_logger, "f")?.debug('Stylelint package root is not inside the workspace', {
            uri: document.uri,
        });
        return undefined;
    }
    const manifestPath = path_1.default.join(packageDir, 'package.json');
    try {
        const rawManifest = await promises_1.default.readFile(manifestPath, 'utf8');
        const manifest = JSON.parse(rawManifest);
        return manifest.version;
    }
    catch (error) {
        __classPrivateFieldGet(this, _OldStylelintWarningModule_logger, "f")?.debug('Stylelint package manifest could not be read', {
            uri: document.uri,
            manifestPath,
            error,
        });
        return undefined;
    }
}, _OldStylelintWarningModule_check = async function _OldStylelintWarningModule_check(document) {
    const workspaceFolder = await (0, index_1.getWorkspaceFolder)(__classPrivateFieldGet(this, _OldStylelintWarningModule_context, "f").connection, document);
    if (!workspaceFolder) {
        __classPrivateFieldGet(this, _OldStylelintWarningModule_logger, "f")?.debug('Document not part of a workspace, ignoring', {
            uri: document.uri,
        });
        return undefined;
    }
    if (__classPrivateFieldGet(this, _OldStylelintWarningModule_checkedWorkspaces, "f").has(workspaceFolder)) {
        __classPrivateFieldGet(this, _OldStylelintWarningModule_logger, "f")?.debug('Document has already been checked, ignoring', {
            uri: document.uri,
        });
        return undefined;
    }
    __classPrivateFieldGet(this, _OldStylelintWarningModule_checkedWorkspaces, "f").add(workspaceFolder);
    const stylelintVersion = await __classPrivateFieldGet(this, _OldStylelintWarningModule_instances, "m", _OldStylelintWarningModule_getStylelintVersion).call(this, document, workspaceFolder);
    if (!stylelintVersion) {
        return undefined;
    }
    try {
        const coerced = semver_1.default.coerce(stylelintVersion);
        if (!coerced) {
            throw new Error(`Could not coerce version "${stylelintVersion}"`);
        }
        return semver_1.default.lt(coerced, '14.0.0') ? stylelintVersion : undefined;
    }
    catch (error) {
        __classPrivateFieldGet(this, _OldStylelintWarningModule_logger, "f")?.debug('Stylelint version could not be parsed', {
            uri: document.uri,
            version: stylelintVersion,
            error,
        });
        return undefined;
    }
};
OldStylelintWarningModule.id = 'old-stylelint-warning';
//# sourceMappingURL=old-stylelint-warning.js.map