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
var _StylelintLanguageServer_instances, _StylelintLanguageServer_state, _StylelintLanguageServer_connection, _StylelintLanguageServer_logger, _StylelintLanguageServer_notifications, _StylelintLanguageServer_commands, _StylelintLanguageServer_globalOptions, _StylelintLanguageServer_resolver, _StylelintLanguageServer_runner, _StylelintLanguageServer_documents, _StylelintLanguageServer_context, _StylelintLanguageServer_modules, _StylelintLanguageServer_hasConfigurationCapability, _StylelintLanguageServer_scopedOptions, _StylelintLanguageServer_disposables, _StylelintLanguageServer_transition, _StylelintLanguageServer_displayError, _StylelintLanguageServer_getOptions, _StylelintLanguageServer_resolveStylelint, _StylelintLanguageServer_lintDocument, _StylelintLanguageServer_getFixes, _StylelintLanguageServer_getModule, _StylelintLanguageServer_registerHandlers, _StylelintLanguageServer_invokeHandlers, _StylelintLanguageServer_onInitialize, _StylelintLanguageServer_onInitialized, _StylelintLanguageServer_onDidCloseDocument, _StylelintLanguageServer_onDidChangeConfiguration;
Object.defineProperty(exports, "__esModule", { value: true });
exports.StylelintLanguageServer = void 0;
const vscode_languageserver_textdocument_1 = require("vscode-languageserver-textdocument");
const node_1 = require("vscode-languageserver/node");
const vscode_languageserver_protocol_1 = require("vscode-languageserver-protocol");
const index_1 = require("../utils/documents/index");
const index_2 = require("../utils/lsp/index");
const index_3 = require("../utils/objects/index");
const index_4 = require("../utils/stylelint/index");
const index_5 = require("../utils/packages/index");
const types_1 = require("./types");
const create_logger_1 = require("./create-logger");
const defaultOptions = {
    codeAction: {
        disableRuleComment: {
            location: 'separateLine',
        },
    },
    config: null,
    configFile: '',
    configBasedir: '',
    customSyntax: '',
    ignoreDisables: false,
    packageManager: 'npm',
    reportDescriptionlessDisables: false,
    reportInvalidScopeDisables: false,
    reportNeedlessDisables: false,
    snippet: ['css', 'postcss'],
    stylelintPath: '',
    validate: ['css', 'postcss'],
};
/**
 * Stylelint language server.
 */
class StylelintLanguageServer {
    /**
     * Creates a new Stylelint language server.
     */
    constructor({ connection, logger, modules }) {
        _StylelintLanguageServer_instances.add(this);
        /**
         * The language server state.
         */
        _StylelintLanguageServer_state.set(this, "New" /* State.New */);
        /**
         * The language server connection.
         */
        _StylelintLanguageServer_connection.set(this, void 0);
        /**
         * The logger to use.
         */
        _StylelintLanguageServer_logger.set(this, void 0);
        /**
         * The notification manager for the connection.
         */
        _StylelintLanguageServer_notifications.set(this, void 0);
        /**
         * The command manager for the connection.
         */
        _StylelintLanguageServer_commands.set(this, void 0);
        /**
         * The global language server options, used if the client does not support
         * the `workspace/configuration` request.
         */
        _StylelintLanguageServer_globalOptions.set(this, void 0);
        /**
         * The resolver used to resolve the Stylelint package.
         */
        _StylelintLanguageServer_resolver.set(this, void 0);
        /**
         * The runner used to run Stylelint.
         */
        _StylelintLanguageServer_runner.set(this, void 0);
        /**
         * The text document manager.
         */
        _StylelintLanguageServer_documents.set(this, void 0);
        /**
         * The language server context passed between modules.
         */
        _StylelintLanguageServer_context.set(this, void 0);
        /**
         * Registered modules.
         */
        _StylelintLanguageServer_modules.set(this, new Map());
        /**
         * Whether or not the client supports the `workspace/configuration` request.
         */
        _StylelintLanguageServer_hasConfigurationCapability.set(this, false);
        /**
         * Configuration per resource.
         */
        _StylelintLanguageServer_scopedOptions.set(this, new Map());
        /**
         * Disposables for handlers.
         */
        _StylelintLanguageServer_disposables.set(this, []);
        __classPrivateFieldSet(this, _StylelintLanguageServer_connection, connection, "f");
        __classPrivateFieldSet(this, _StylelintLanguageServer_logger, (logger ?? (0, create_logger_1.createLogger)(connection))?.child({ component: 'language-server' }), "f");
        __classPrivateFieldSet(this, _StylelintLanguageServer_notifications, new index_2.NotificationManager(connection, __classPrivateFieldGet(this, _StylelintLanguageServer_logger, "f")), "f");
        __classPrivateFieldSet(this, _StylelintLanguageServer_commands, new index_2.CommandManager(connection, __classPrivateFieldGet(this, _StylelintLanguageServer_logger, "f")), "f");
        __classPrivateFieldSet(this, _StylelintLanguageServer_globalOptions, defaultOptions, "f");
        __classPrivateFieldSet(this, _StylelintLanguageServer_resolver, new index_5.StylelintResolver(connection, __classPrivateFieldGet(this, _StylelintLanguageServer_logger, "f")), "f");
        __classPrivateFieldSet(this, _StylelintLanguageServer_runner, new index_4.StylelintRunner(connection, __classPrivateFieldGet(this, _StylelintLanguageServer_logger, "f"), __classPrivateFieldGet(this, _StylelintLanguageServer_resolver, "f")), "f");
        __classPrivateFieldSet(this, _StylelintLanguageServer_documents, new node_1.TextDocuments(vscode_languageserver_textdocument_1.TextDocument), "f");
        __classPrivateFieldSet(this, _StylelintLanguageServer_context, {
            connection: __classPrivateFieldGet(this, _StylelintLanguageServer_connection, "f"),
            notifications: __classPrivateFieldGet(this, _StylelintLanguageServer_notifications, "f"),
            commands: __classPrivateFieldGet(this, _StylelintLanguageServer_commands, "f"),
            documents: __classPrivateFieldGet(this, _StylelintLanguageServer_documents, "f"),
            runner: __classPrivateFieldGet(this, _StylelintLanguageServer_runner, "f"),
            getOptions: __classPrivateFieldGet(this, _StylelintLanguageServer_instances, "m", _StylelintLanguageServer_getOptions).bind(this),
            getModule: __classPrivateFieldGet(this, _StylelintLanguageServer_instances, "m", _StylelintLanguageServer_getModule).bind(this),
            getFixes: __classPrivateFieldGet(this, _StylelintLanguageServer_instances, "m", _StylelintLanguageServer_getFixes).bind(this),
            displayError: __classPrivateFieldGet(this, _StylelintLanguageServer_instances, "m", _StylelintLanguageServer_displayError).bind(this),
            lintDocument: __classPrivateFieldGet(this, _StylelintLanguageServer_instances, "m", _StylelintLanguageServer_lintDocument).bind(this),
            resolveStylelint: __classPrivateFieldGet(this, _StylelintLanguageServer_instances, "m", _StylelintLanguageServer_resolveStylelint).bind(this),
        }, "f");
        const contextReadOnlyProxy = new Proxy(__classPrivateFieldGet(this, _StylelintLanguageServer_context, "f"), {
            get(target, name) {
                return target[name];
            },
            set() {
                throw new Error('Cannot set read-only property');
            },
        });
        if (modules) {
            for (const Module of modules) {
                __classPrivateFieldGet(this, _StylelintLanguageServer_logger, "f").info('Registering module', { module: Module.id });
                if (!Module.id) {
                    throw new Error('Modules must have an ID');
                }
                if (typeof Module.id !== 'string') {
                    throw new Error('Module IDs must be strings');
                }
                const module = new Module({
                    context: contextReadOnlyProxy,
                    logger: logger?.child({ component: `language-server:${Module.id}` }),
                });
                if (__classPrivateFieldGet(this, _StylelintLanguageServer_modules, "f").has(Module.id)) {
                    throw new Error(`Module with ID "${Module.id}" already registered`);
                }
                __classPrivateFieldGet(this, _StylelintLanguageServer_modules, "f").set(Module.id, module);
                __classPrivateFieldGet(this, _StylelintLanguageServer_logger, "f").info('Module registered', { module: Module.id });
            }
        }
    }
    /**
     * Starts the language server.
     */
    start() {
        __classPrivateFieldGet(this, _StylelintLanguageServer_instances, "m", _StylelintLanguageServer_transition).call(this, "Started" /* State.Started */);
        __classPrivateFieldGet(this, _StylelintLanguageServer_logger, "f").info('Starting language server');
        __classPrivateFieldGet(this, _StylelintLanguageServer_documents, "f").listen(__classPrivateFieldGet(this, _StylelintLanguageServer_connection, "f"));
        __classPrivateFieldGet(this, _StylelintLanguageServer_connection, "f").listen();
        __classPrivateFieldGet(this, _StylelintLanguageServer_instances, "m", _StylelintLanguageServer_registerHandlers).call(this);
        __classPrivateFieldGet(this, _StylelintLanguageServer_logger, "f").info('Language server started');
    }
    /**
     * Disposes the language server.
     */
    dispose() {
        try {
            __classPrivateFieldGet(this, _StylelintLanguageServer_instances, "m", _StylelintLanguageServer_transition).call(this, "Disposed" /* State.Disposed */);
        }
        catch {
            return;
        }
        __classPrivateFieldGet(this, _StylelintLanguageServer_logger, "f").info('Stopping language server');
        __classPrivateFieldGet(this, _StylelintLanguageServer_modules, "f").forEach((module) => module.dispose());
        __classPrivateFieldGet(this, _StylelintLanguageServer_disposables, "f").forEach((disposable) => disposable.dispose());
        __classPrivateFieldGet(this, _StylelintLanguageServer_disposables, "f").length = 0;
        __classPrivateFieldGet(this, _StylelintLanguageServer_connection, "f").onInitialize(() => ({ capabilities: {} }));
        __classPrivateFieldGet(this, _StylelintLanguageServer_connection, "f").onShutdown(() => undefined);
        __classPrivateFieldGet(this, _StylelintLanguageServer_modules, "f").clear();
        __classPrivateFieldGet(this, _StylelintLanguageServer_notifications, "f").dispose();
        __classPrivateFieldGet(this, _StylelintLanguageServer_commands, "f").dispose();
        __classPrivateFieldGet(this, _StylelintLanguageServer_connection, "f").dispose();
    }
}
exports.StylelintLanguageServer = StylelintLanguageServer;
_StylelintLanguageServer_state = new WeakMap(), _StylelintLanguageServer_connection = new WeakMap(), _StylelintLanguageServer_logger = new WeakMap(), _StylelintLanguageServer_notifications = new WeakMap(), _StylelintLanguageServer_commands = new WeakMap(), _StylelintLanguageServer_globalOptions = new WeakMap(), _StylelintLanguageServer_resolver = new WeakMap(), _StylelintLanguageServer_runner = new WeakMap(), _StylelintLanguageServer_documents = new WeakMap(), _StylelintLanguageServer_context = new WeakMap(), _StylelintLanguageServer_modules = new WeakMap(), _StylelintLanguageServer_hasConfigurationCapability = new WeakMap(), _StylelintLanguageServer_scopedOptions = new WeakMap(), _StylelintLanguageServer_disposables = new WeakMap(), _StylelintLanguageServer_instances = new WeakSet(), _StylelintLanguageServer_transition = function _StylelintLanguageServer_transition(state) {
    if (__classPrivateFieldGet(this, _StylelintLanguageServer_state, "f") === state) {
        throw new Error(`Cannot transition from state ${state} to itself`);
    }
    // We only have a handful of states, so we can use a switch statement.
    switch (__classPrivateFieldGet(this, _StylelintLanguageServer_state, "f")) {
        // We don't need to check State.New since the only invalid state
        // transition from New is to Initialized, and the handler for
        // InitializedNotification isn't registered until the server is
        // started.
        // We don't need to check State.Started since the only invalid state
        // transition from Started is to New and we never transition to New.
        case "Initialized" /* State.Initialized */:
            if (state !== "Disposed" /* State.Disposed */) {
                throw new Error('Can only transition state from Initialized to Disposed');
            }
            break;
        case "Disposed" /* State.Disposed */:
            throw new Error('Cannot transition from Disposed');
        default:
            break;
    }
    __classPrivateFieldSet(this, _StylelintLanguageServer_state, state, "f");
}, _StylelintLanguageServer_displayError = function _StylelintLanguageServer_displayError(error) {
    (0, index_2.displayError)(__classPrivateFieldGet(this, _StylelintLanguageServer_connection, "f"), error);
}, _StylelintLanguageServer_getOptions = async function _StylelintLanguageServer_getOptions(resource) {
    if (!__classPrivateFieldGet(this, _StylelintLanguageServer_hasConfigurationCapability, "f")) {
        return __classPrivateFieldGet(this, _StylelintLanguageServer_globalOptions, "f");
    }
    const cached = __classPrivateFieldGet(this, _StylelintLanguageServer_scopedOptions, "f").get(resource);
    if (cached) {
        __classPrivateFieldGet(this, _StylelintLanguageServer_logger, "f").debug('Returning cached options', { resource });
        return cached;
    }
    __classPrivateFieldGet(this, _StylelintLanguageServer_logger, "f").debug('Requesting options from client', { resource });
    const options = (await __classPrivateFieldGet(this, _StylelintLanguageServer_connection, "f").workspace.getConfiguration({
        scopeUri: resource,
        section: 'stylelint',
    }));
    __classPrivateFieldGet(this, _StylelintLanguageServer_logger, "f").debug('Received options from client', { resource, options });
    const withDefaults = (0, index_3.mergeOptionsWithDefaults)(options, defaultOptions);
    Object.freeze(withDefaults);
    __classPrivateFieldGet(this, _StylelintLanguageServer_scopedOptions, "f").set(resource, withDefaults);
    __classPrivateFieldGet(this, _StylelintLanguageServer_logger, "f").debug('Returning options', { resource, options: withDefaults });
    return withDefaults;
}, _StylelintLanguageServer_resolveStylelint = 
/**
 * Resolves the Stylelint package for the given document.
 */
async function _StylelintLanguageServer_resolveStylelint(document) {
    __classPrivateFieldGet(this, _StylelintLanguageServer_logger, "f").debug('Resolving Stylelint', { uri: document.uri });
    try {
        const options = await __classPrivateFieldGet(this, _StylelintLanguageServer_instances, "m", _StylelintLanguageServer_getOptions).call(this, document.uri);
        const result = await __classPrivateFieldGet(this, _StylelintLanguageServer_resolver, "f").resolve(options, document);
        if (result) {
            __classPrivateFieldGet(this, _StylelintLanguageServer_logger, "f").debug('Stylelint resolved', {
                uri: document.uri,
                resolvedPath: result.resolvedPath,
            });
        }
        else {
            __classPrivateFieldGet(this, _StylelintLanguageServer_logger, "f").warn('Failed to resolve Stylelint', { uri: document.uri });
        }
        return result;
    }
    catch (error) {
        __classPrivateFieldGet(this, _StylelintLanguageServer_instances, "m", _StylelintLanguageServer_displayError).call(this, error);
        __classPrivateFieldGet(this, _StylelintLanguageServer_logger, "f").error('Error resolving Stylelint', { uri: document.uri, error });
        return undefined;
    }
}, _StylelintLanguageServer_lintDocument = 
/**
 * Lints a document using Stylelint.
 */
async function _StylelintLanguageServer_lintDocument(document, linterOptions = {}) {
    __classPrivateFieldGet(this, _StylelintLanguageServer_logger, "f").debug('Linting document', { uri: document.uri, linterOptions });
    try {
        const options = await __classPrivateFieldGet(this, _StylelintLanguageServer_instances, "m", _StylelintLanguageServer_getOptions).call(this, document.uri);
        const results = await __classPrivateFieldGet(this, _StylelintLanguageServer_runner, "f").lintDocument(document, linterOptions, options);
        __classPrivateFieldGet(this, _StylelintLanguageServer_logger, "f").debug('Lint run complete', { uri: document.uri, results });
        return results;
    }
    catch (err) {
        __classPrivateFieldGet(this, _StylelintLanguageServer_instances, "m", _StylelintLanguageServer_displayError).call(this, err);
        __classPrivateFieldGet(this, _StylelintLanguageServer_logger, "f").error('Error running lint', { uri: document.uri, error: err });
        return undefined;
    }
}, _StylelintLanguageServer_getFixes = 
/**
 * Gets text edits for fixes made by Stylelint.
 */
async function _StylelintLanguageServer_getFixes(document, linterOptions = {}) {
    try {
        const options = await __classPrivateFieldGet(this, _StylelintLanguageServer_instances, "m", _StylelintLanguageServer_getOptions).call(this, document.uri);
        const edits = await (0, index_1.getFixes)(__classPrivateFieldGet(this, _StylelintLanguageServer_runner, "f"), document, linterOptions, options);
        __classPrivateFieldGet(this, _StylelintLanguageServer_logger, "f").debug('Fixes retrieved', { uri: document.uri, edits });
        return edits;
    }
    catch (error) {
        __classPrivateFieldGet(this, _StylelintLanguageServer_instances, "m", _StylelintLanguageServer_displayError).call(this, error);
        __classPrivateFieldGet(this, _StylelintLanguageServer_logger, "f").error('Error getting fixes', { uri: document.uri, error });
        return [];
    }
}, _StylelintLanguageServer_getModule = function _StylelintLanguageServer_getModule(id) {
    return __classPrivateFieldGet(this, _StylelintLanguageServer_modules, "f").get(id);
}, _StylelintLanguageServer_registerHandlers = function _StylelintLanguageServer_registerHandlers() {
    __classPrivateFieldGet(this, _StylelintLanguageServer_logger, "f").info('Registering handlers');
    __classPrivateFieldGet(this, _StylelintLanguageServer_connection, "f").onInitialize(__classPrivateFieldGet(this, _StylelintLanguageServer_instances, "m", _StylelintLanguageServer_onInitialize).bind(this));
    __classPrivateFieldGet(this, _StylelintLanguageServer_logger, "f").debug('connection.onInitialize handler registered');
    __classPrivateFieldGet(this, _StylelintLanguageServer_disposables, "f").push(__classPrivateFieldGet(this, _StylelintLanguageServer_notifications, "f").on(vscode_languageserver_protocol_1.InitializedNotification.type, __classPrivateFieldGet(this, _StylelintLanguageServer_instances, "m", _StylelintLanguageServer_onInitialized).bind(this)));
    __classPrivateFieldGet(this, _StylelintLanguageServer_logger, "f").debug('connection.onInitialized handler registered');
    __classPrivateFieldGet(this, _StylelintLanguageServer_connection, "f").onShutdown(() => this.dispose());
    __classPrivateFieldGet(this, _StylelintLanguageServer_logger, "f").debug('connection.onShutdown handler registered');
    __classPrivateFieldGet(this, _StylelintLanguageServer_commands, "f").register();
    __classPrivateFieldGet(this, _StylelintLanguageServer_disposables, "f").push(__classPrivateFieldGet(this, _StylelintLanguageServer_notifications, "f").on(vscode_languageserver_protocol_1.DidChangeConfigurationNotification.type, __classPrivateFieldGet(this, _StylelintLanguageServer_instances, "m", _StylelintLanguageServer_onDidChangeConfiguration).bind(this)));
    __classPrivateFieldGet(this, _StylelintLanguageServer_logger, "f").debug('connection.onDidChangeConfiguration handler registered');
    __classPrivateFieldGet(this, _StylelintLanguageServer_disposables, "f").push(__classPrivateFieldGet(this, _StylelintLanguageServer_documents, "f").onDidClose(__classPrivateFieldGet(this, _StylelintLanguageServer_instances, "m", _StylelintLanguageServer_onDidCloseDocument).bind(this)));
    __classPrivateFieldGet(this, _StylelintLanguageServer_logger, "f").debug('documents.onDidClose handler registered');
    __classPrivateFieldGet(this, _StylelintLanguageServer_instances, "m", _StylelintLanguageServer_invokeHandlers).call(this, 'onDidRegisterHandlers');
    __classPrivateFieldGet(this, _StylelintLanguageServer_logger, "f").info('Handlers registered');
}, _StylelintLanguageServer_invokeHandlers = function _StylelintLanguageServer_invokeHandlers(handlerName, ...params) {
    __classPrivateFieldGet(this, _StylelintLanguageServer_logger, "f").debug(`Invoking ${String(handlerName)}`);
    const returnValues = Object.create(null);
    for (const [id, module] of __classPrivateFieldGet(this, _StylelintLanguageServer_modules, "f")) {
        const handler = module[handlerName];
        if (handler) {
            try {
                returnValues[id] = handler.apply(module, params);
                __classPrivateFieldGet(this, _StylelintLanguageServer_logger, "f").debug(`Invoked ${String(handlerName)}`, {
                    module: id,
                    returnValue: returnValues[id],
                });
            }
            catch (error) {
                __classPrivateFieldGet(this, _StylelintLanguageServer_instances, "m", _StylelintLanguageServer_displayError).call(this, error);
                __classPrivateFieldGet(this, _StylelintLanguageServer_logger, "f").error(`Error invoking ${String(handlerName)}`, {
                    module: id,
                    error,
                });
            }
        }
    }
    return returnValues;
}, _StylelintLanguageServer_onInitialize = function _StylelintLanguageServer_onInitialize(params) {
    __classPrivateFieldGet(this, _StylelintLanguageServer_logger, "f").debug('received onInitialize', { params });
    const result = {
        capabilities: {
            textDocumentSync: {
                openClose: true,
                change: vscode_languageserver_protocol_1.TextDocumentSyncKind.Full,
            },
        },
    };
    if (params.capabilities.workspace?.configuration) {
        __classPrivateFieldGet(this, _StylelintLanguageServer_logger, "f").debug('Client reports workspace configuration support; using scoped configuration');
        __classPrivateFieldSet(this, _StylelintLanguageServer_hasConfigurationCapability, true, "f");
    }
    for (const [, moduleResult] of Object.entries(__classPrivateFieldGet(this, _StylelintLanguageServer_instances, "m", _StylelintLanguageServer_invokeHandlers).call(this, 'onInitialize', params))) {
        if (moduleResult) {
            (0, index_3.mergeAssign)(result, moduleResult);
        }
    }
    __classPrivateFieldGet(this, _StylelintLanguageServer_logger, "f").debug('Returning initialization results', { result });
    return result;
}, _StylelintLanguageServer_onInitialized = async function _StylelintLanguageServer_onInitialized(params) {
    __classPrivateFieldGet(this, _StylelintLanguageServer_instances, "m", _StylelintLanguageServer_transition).call(this, "Initialized" /* State.Initialized */);
    __classPrivateFieldGet(this, _StylelintLanguageServer_logger, "f").debug('received onInitialized', { params });
    if (__classPrivateFieldGet(this, _StylelintLanguageServer_hasConfigurationCapability, "f")) {
        __classPrivateFieldGet(this, _StylelintLanguageServer_logger, "f").debug('Registering DidChangeConfigurationNotification');
        await __classPrivateFieldGet(this, _StylelintLanguageServer_connection, "f").client.register(vscode_languageserver_protocol_1.DidChangeConfigurationNotification.type, {
            section: 'stylelint',
        });
    }
}, _StylelintLanguageServer_onDidCloseDocument = function _StylelintLanguageServer_onDidCloseDocument({ document }) {
    __classPrivateFieldGet(this, _StylelintLanguageServer_logger, "f").debug('received documents.onDidClose, clearing cached options', {
        uri: document.uri,
    });
    __classPrivateFieldGet(this, _StylelintLanguageServer_scopedOptions, "f").delete(document.uri);
}, _StylelintLanguageServer_onDidChangeConfiguration = async function _StylelintLanguageServer_onDidChangeConfiguration(params) {
    if (__classPrivateFieldGet(this, _StylelintLanguageServer_hasConfigurationCapability, "f")) {
        __classPrivateFieldGet(this, _StylelintLanguageServer_logger, "f").debug('received onDidChangeConfiguration, clearing cached options', { params });
        __classPrivateFieldGet(this, _StylelintLanguageServer_scopedOptions, "f").clear();
        __classPrivateFieldGet(this, _StylelintLanguageServer_instances, "m", _StylelintLanguageServer_invokeHandlers).call(this, 'onDidChangeConfiguration');
        await __classPrivateFieldGet(this, _StylelintLanguageServer_connection, "f").sendNotification(types_1.Notification.DidResetConfiguration);
        return;
    }
    __classPrivateFieldGet(this, _StylelintLanguageServer_logger, "f").debug('received onDidChangeConfiguration', { params });
    __classPrivateFieldSet(this, _StylelintLanguageServer_globalOptions, (0, index_3.mergeOptionsWithDefaults)(params.settings.stylelint, defaultOptions), "f");
    Object.freeze(__classPrivateFieldGet(this, _StylelintLanguageServer_globalOptions, "f"));
    __classPrivateFieldGet(this, _StylelintLanguageServer_logger, "f").debug('Global options updated', { options: __classPrivateFieldGet(this, _StylelintLanguageServer_globalOptions, "f") });
    __classPrivateFieldGet(this, _StylelintLanguageServer_instances, "m", _StylelintLanguageServer_invokeHandlers).call(this, 'onDidChangeConfiguration');
};
//# sourceMappingURL=server.js.map