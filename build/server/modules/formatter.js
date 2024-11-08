"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
var _FormatterModule_instances, _FormatterModule_context, _FormatterModule_logger, _FormatterModule_registerDynamically, _FormatterModule_registrations, _FormatterModule_disposables, _FormatterModule_shouldFormat, _FormatterModule_register, _FormatterModule_deregister, _FormatterModule_deregisterAll;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormatterModule = void 0;
const LSP = __importStar(require("vscode-languageserver-protocol"));
const index_1 = require("../../utils/stylelint/index");
const types_1 = require("../types");
const vscode_uri_1 = require("vscode-uri");
class FormatterModule {
    constructor({ context, logger }) {
        _FormatterModule_instances.add(this);
        /**
         * The language server context.
         */
        _FormatterModule_context.set(this, void 0);
        /**
         * The logger to use, if any.
         */
        _FormatterModule_logger.set(this, void 0);
        /**
         * Whether or not dynamic registration for document formatting should be
         * attempted.
         */
        _FormatterModule_registerDynamically.set(this, false);
        /**
         * Promises that resolve to the disposables for the dynamically registered
         * document formatters, by resource URI.
         */
        _FormatterModule_registrations.set(this, new Map());
        /**
         * Disposables for handlers.
         */
        _FormatterModule_disposables.set(this, []);
        __classPrivateFieldSet(this, _FormatterModule_context, context, "f");
        __classPrivateFieldSet(this, _FormatterModule_logger, logger, "f");
    }
    dispose() {
        __classPrivateFieldGet(this, _FormatterModule_context, "f").connection.onDocumentFormatting(() => undefined);
        __classPrivateFieldGet(this, _FormatterModule_disposables, "f").forEach((disposable) => disposable.dispose());
        __classPrivateFieldGet(this, _FormatterModule_disposables, "f").length = 0;
        __classPrivateFieldGet(this, _FormatterModule_instances, "m", _FormatterModule_deregisterAll).call(this);
    }
    onInitialize({ capabilities }) {
        __classPrivateFieldSet(this, _FormatterModule_registerDynamically, Boolean(capabilities.textDocument?.formatting?.dynamicRegistration), "f");
        return {
            capabilities: {
                // Use static registration if dynamic registration is not
                // supported by the client
                documentFormattingProvider: !__classPrivateFieldGet(this, _FormatterModule_registerDynamically, "f"),
            },
        };
    }
    onDidRegisterHandlers() {
        __classPrivateFieldGet(this, _FormatterModule_logger, "f")?.debug('Registering connection.onDocumentFormatting handler');
        __classPrivateFieldGet(this, _FormatterModule_context, "f").connection.onDocumentFormatting(async ({ textDocument, options }) => {
            __classPrivateFieldGet(this, _FormatterModule_logger, "f")?.debug('Received onDocumentFormatting', { textDocument, options });
            if (!textDocument) {
                __classPrivateFieldGet(this, _FormatterModule_logger, "f")?.debug('No text document provided, ignoring');
                return null;
            }
            const { uri } = textDocument;
            const document = __classPrivateFieldGet(this, _FormatterModule_context, "f").documents.get(uri);
            if (!document || !(await __classPrivateFieldGet(this, _FormatterModule_instances, "m", _FormatterModule_shouldFormat).call(this, document))) {
                if (__classPrivateFieldGet(this, _FormatterModule_logger, "f")?.isDebugEnabled()) {
                    if (!document) {
                        __classPrivateFieldGet(this, _FormatterModule_logger, "f").debug('Unknown document, ignoring', { uri });
                    }
                    else {
                        __classPrivateFieldGet(this, _FormatterModule_logger, "f").debug('Document should not be formatted, ignoring', {
                            uri,
                            language: document.languageId,
                        });
                    }
                }
                return null;
            }
            const linterOptions = {
                config: {
                    rules: (0, index_1.formattingOptionsToRules)(options),
                },
            };
            __classPrivateFieldGet(this, _FormatterModule_logger, "f")?.debug('Formatting document', { uri, linterOptions });
            const fixes = __classPrivateFieldGet(this, _FormatterModule_context, "f").getFixes(document, linterOptions);
            __classPrivateFieldGet(this, _FormatterModule_logger, "f")?.debug('Returning fixes', { uri, fixes });
            return fixes;
        });
        __classPrivateFieldGet(this, _FormatterModule_logger, "f")?.debug('connection.onDocumentFormatting handler registered');
        __classPrivateFieldGet(this, _FormatterModule_logger, "f")?.debug('Registering documents.onDidOpen handler');
        __classPrivateFieldGet(this, _FormatterModule_disposables, "f").push(__classPrivateFieldGet(this, _FormatterModule_context, "f").documents.onDidOpen(({ document }) => __classPrivateFieldGet(this, _FormatterModule_instances, "m", _FormatterModule_register).call(this, document)));
        __classPrivateFieldGet(this, _FormatterModule_logger, "f")?.debug('documents.onDidOpen handler registered');
        __classPrivateFieldGet(this, _FormatterModule_logger, "f")?.debug('Registering documents.onDidChangeContent handler');
        __classPrivateFieldGet(this, _FormatterModule_disposables, "f").push(__classPrivateFieldGet(this, _FormatterModule_context, "f").documents.onDidChangeContent(({ document }) => __classPrivateFieldGet(this, _FormatterModule_instances, "m", _FormatterModule_register).call(this, document)));
        __classPrivateFieldGet(this, _FormatterModule_logger, "f")?.debug('documents.onDidChangeContent handler registered');
        __classPrivateFieldGet(this, _FormatterModule_logger, "f")?.debug('Registering documents.onDidSave handler');
        __classPrivateFieldGet(this, _FormatterModule_disposables, "f").push(__classPrivateFieldGet(this, _FormatterModule_context, "f").documents.onDidSave(({ document }) => __classPrivateFieldGet(this, _FormatterModule_instances, "m", _FormatterModule_register).call(this, document)));
        __classPrivateFieldGet(this, _FormatterModule_logger, "f")?.debug('documents.onDidSave handler registered');
        __classPrivateFieldGet(this, _FormatterModule_logger, "f")?.debug('Registering documents.onDidClose handler');
        __classPrivateFieldGet(this, _FormatterModule_disposables, "f").push(__classPrivateFieldGet(this, _FormatterModule_context, "f").documents.onDidClose(({ document }) => __classPrivateFieldGet(this, _FormatterModule_instances, "m", _FormatterModule_deregister).call(this, document.uri)));
        __classPrivateFieldGet(this, _FormatterModule_logger, "f")?.debug('documents.onDidClose handler registered');
        __classPrivateFieldGet(this, _FormatterModule_logger, "f")?.debug('Registering DidChangeConfigurationNotification');
        __classPrivateFieldGet(this, _FormatterModule_disposables, "f").push(__classPrivateFieldGet(this, _FormatterModule_context, "f").notifications.on(LSP.DidChangeConfigurationNotification.type, () => __classPrivateFieldGet(this, _FormatterModule_instances, "m", _FormatterModule_deregisterAll).call(this)));
        __classPrivateFieldGet(this, _FormatterModule_logger, "f")?.debug('DidChangeConfigurationNotification registered');
        __classPrivateFieldGet(this, _FormatterModule_logger, "f")?.debug('Registering DidChangeWorkspaceFoldersNotification');
        __classPrivateFieldGet(this, _FormatterModule_disposables, "f").push(__classPrivateFieldGet(this, _FormatterModule_context, "f").notifications.on(LSP.DidChangeWorkspaceFoldersNotification.type, () => __classPrivateFieldGet(this, _FormatterModule_instances, "m", _FormatterModule_deregisterAll).call(this)));
        __classPrivateFieldGet(this, _FormatterModule_logger, "f")?.debug('DidChangeWorkspaceFoldersNotification registered');
    }
}
exports.FormatterModule = FormatterModule;
_FormatterModule_context = new WeakMap(), _FormatterModule_logger = new WeakMap(), _FormatterModule_registerDynamically = new WeakMap(), _FormatterModule_registrations = new WeakMap(), _FormatterModule_disposables = new WeakMap(), _FormatterModule_instances = new WeakSet(), _FormatterModule_shouldFormat = async function _FormatterModule_shouldFormat(document) {
    const options = await __classPrivateFieldGet(this, _FormatterModule_context, "f").getOptions(document.uri);
    return options.validate.includes(document.languageId);
}, _FormatterModule_register = async function _FormatterModule_register(document) {
    if (!__classPrivateFieldGet(this, _FormatterModule_registerDynamically, "f") ||
        !(await __classPrivateFieldGet(this, _FormatterModule_instances, "m", _FormatterModule_shouldFormat).call(this, document)) ||
        __classPrivateFieldGet(this, _FormatterModule_registrations, "f").has(document.uri)) {
        return;
    }
    const { scheme, fsPath } = vscode_uri_1.URI.parse(document.uri);
    const pattern = (scheme === 'file' ? fsPath.replace(/\\/g, '/') : fsPath).replace(/[[\]{}]/g, '?');
    const filter = { scheme, pattern };
    const options = { documentSelector: [filter] };
    __classPrivateFieldGet(this, _FormatterModule_registrations, "f").set(document.uri, __classPrivateFieldGet(this, _FormatterModule_context, "f").connection.client.register(LSP.DocumentFormattingRequest.type, options));
    __classPrivateFieldGet(this, _FormatterModule_logger, "f")?.debug('Registering formatter for document', { uri: document.uri, options });
    await __classPrivateFieldGet(this, _FormatterModule_context, "f").connection.sendNotification(types_1.Notification.DidRegisterDocumentFormattingEditProvider, { uri: document.uri, options });
}, _FormatterModule_deregister = function _FormatterModule_deregister(uri) {
    const registration = __classPrivateFieldGet(this, _FormatterModule_registrations, "f").get(uri);
    if (!registration) {
        return;
    }
    __classPrivateFieldGet(this, _FormatterModule_logger, "f")?.debug('Deregistering formatter for document', { uri });
    registration
        .then((d) => d.dispose())
        .catch((error) => {
        __classPrivateFieldGet(this, _FormatterModule_logger, "f")?.error('Error deregistering formatter for document', { uri, error });
    });
    __classPrivateFieldGet(this, _FormatterModule_registrations, "f").delete(uri);
}, _FormatterModule_deregisterAll = function _FormatterModule_deregisterAll() {
    for (const [uri, registration] of __classPrivateFieldGet(this, _FormatterModule_registrations, "f")) {
        __classPrivateFieldGet(this, _FormatterModule_logger, "f")?.debug('Deregistering formatter for document', { uri });
        registration
            .then((d) => d.dispose())
            .catch((error) => {
            __classPrivateFieldGet(this, _FormatterModule_logger, "f")?.error('Error deregistering formatter for document', { uri, error });
        });
    }
    __classPrivateFieldGet(this, _FormatterModule_registrations, "f").clear();
};
FormatterModule.id = 'formatter';
//# sourceMappingURL=formatter.js.map