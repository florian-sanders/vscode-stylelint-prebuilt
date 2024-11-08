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
var _ValidatorModule_instances, _ValidatorModule_context, _ValidatorModule_logger, _ValidatorModule_documentDiagnostics, _ValidatorModule_disposables, _ValidatorModule_shouldValidate, _ValidatorModule_validate, _ValidatorModule_validateAll, _ValidatorModule_clearDiagnostics;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidatorModule = void 0;
const vscode_languageserver_protocol_1 = require("vscode-languageserver-protocol");
class ValidatorModule {
    constructor({ context, logger }) {
        _ValidatorModule_instances.add(this);
        /**
         * The language server context.
         */
        _ValidatorModule_context.set(this, void 0);
        /**
         * The logger to use, if any.
         */
        _ValidatorModule_logger.set(this, void 0);
        /**
         * Diagnostics for each document by URI.
         */
        _ValidatorModule_documentDiagnostics.set(this, new Map());
        /**
         * Disposables for handlers.
         */
        _ValidatorModule_disposables.set(this, []);
        __classPrivateFieldSet(this, _ValidatorModule_context, context, "f");
        __classPrivateFieldSet(this, _ValidatorModule_logger, logger, "f");
    }
    dispose() {
        __classPrivateFieldGet(this, _ValidatorModule_disposables, "f").forEach((disposable) => disposable.dispose());
        __classPrivateFieldGet(this, _ValidatorModule_disposables, "f").length = 0;
    }
    getDiagnostics(uri) {
        return __classPrivateFieldGet(this, _ValidatorModule_documentDiagnostics, "f").get(uri) ?? [];
    }
    onInitialize() {
        void __classPrivateFieldGet(this, _ValidatorModule_instances, "m", _ValidatorModule_validateAll).call(this);
    }
    onDidRegisterHandlers() {
        __classPrivateFieldGet(this, _ValidatorModule_logger, "f")?.debug('Registering handlers');
        __classPrivateFieldGet(this, _ValidatorModule_disposables, "f").push(__classPrivateFieldGet(this, _ValidatorModule_context, "f").notifications.on(vscode_languageserver_protocol_1.DidChangeWatchedFilesNotification.type, async () => await __classPrivateFieldGet(this, _ValidatorModule_instances, "m", _ValidatorModule_validateAll).call(this)));
        __classPrivateFieldGet(this, _ValidatorModule_logger, "f")?.debug('onDidChangeWatchedFiles handler registered');
        __classPrivateFieldGet(this, _ValidatorModule_disposables, "f").push(__classPrivateFieldGet(this, _ValidatorModule_context, "f").documents.onDidChangeContent(async ({ document }) => await __classPrivateFieldGet(this, _ValidatorModule_instances, "m", _ValidatorModule_validate).call(this, document)));
        __classPrivateFieldGet(this, _ValidatorModule_logger, "f")?.debug('onDidChangeContent handler registered');
        __classPrivateFieldGet(this, _ValidatorModule_disposables, "f").push(__classPrivateFieldGet(this, _ValidatorModule_context, "f").documents.onDidClose(async ({ document }) => {
            await __classPrivateFieldGet(this, _ValidatorModule_instances, "m", _ValidatorModule_clearDiagnostics).call(this, document);
        }));
        __classPrivateFieldGet(this, _ValidatorModule_logger, "f")?.debug('onDidClose handler registered');
        __classPrivateFieldGet(this, _ValidatorModule_logger, "f")?.debug('Handlers registered');
    }
    async onDidChangeConfiguration() {
        __classPrivateFieldGet(this, _ValidatorModule_logger, "f")?.debug('Received onDidChangeConfiguration');
        await __classPrivateFieldGet(this, _ValidatorModule_instances, "m", _ValidatorModule_validateAll).call(this);
    }
}
exports.ValidatorModule = ValidatorModule;
_ValidatorModule_context = new WeakMap(), _ValidatorModule_logger = new WeakMap(), _ValidatorModule_documentDiagnostics = new WeakMap(), _ValidatorModule_disposables = new WeakMap(), _ValidatorModule_instances = new WeakSet(), _ValidatorModule_shouldValidate = async function _ValidatorModule_shouldValidate(document) {
    const options = await __classPrivateFieldGet(this, _ValidatorModule_context, "f").getOptions(document.uri);
    return options.validate.includes(document.languageId);
}, _ValidatorModule_validate = async function _ValidatorModule_validate(document) {
    if (!(await __classPrivateFieldGet(this, _ValidatorModule_instances, "m", _ValidatorModule_shouldValidate).call(this, document))) {
        if (__classPrivateFieldGet(this, _ValidatorModule_documentDiagnostics, "f").has(document.uri)) {
            __classPrivateFieldGet(this, _ValidatorModule_logger, "f")?.debug('Document should not be validated, clearing diagnostics', {
                uri: document.uri,
                language: document.languageId,
            });
            await __classPrivateFieldGet(this, _ValidatorModule_instances, "m", _ValidatorModule_clearDiagnostics).call(this, document);
        }
        else {
            __classPrivateFieldGet(this, _ValidatorModule_logger, "f")?.debug('Document should not be validated, ignoring', {
                uri: document.uri,
                language: document.languageId,
            });
        }
        return;
    }
    const result = await __classPrivateFieldGet(this, _ValidatorModule_context, "f").lintDocument(document);
    if (!result) {
        __classPrivateFieldGet(this, _ValidatorModule_logger, "f")?.debug('No lint result, ignoring', { uri: document.uri });
        return;
    }
    __classPrivateFieldGet(this, _ValidatorModule_logger, "f")?.debug('Sending diagnostics', { uri: document.uri, result });
    try {
        await __classPrivateFieldGet(this, _ValidatorModule_context, "f").connection.sendDiagnostics({
            uri: document.uri,
            diagnostics: result.diagnostics,
        });
        __classPrivateFieldGet(this, _ValidatorModule_documentDiagnostics, "f").set(document.uri, result.diagnostics);
        __classPrivateFieldGet(this, _ValidatorModule_logger, "f")?.debug('Diagnostics sent', { uri: document.uri });
    }
    catch (error) {
        __classPrivateFieldGet(this, _ValidatorModule_context, "f").displayError(error);
        __classPrivateFieldGet(this, _ValidatorModule_logger, "f")?.error('Failed to send diagnostics', { uri: document.uri, error });
    }
}, _ValidatorModule_validateAll = async function _ValidatorModule_validateAll() {
    await Promise.allSettled(__classPrivateFieldGet(this, _ValidatorModule_context, "f").documents.all().map((document) => __classPrivateFieldGet(this, _ValidatorModule_instances, "m", _ValidatorModule_validate).call(this, document)));
}, _ValidatorModule_clearDiagnostics = async function _ValidatorModule_clearDiagnostics({ uri }) {
    __classPrivateFieldGet(this, _ValidatorModule_logger, "f")?.debug('Clearing diagnostics for document', { uri });
    __classPrivateFieldGet(this, _ValidatorModule_documentDiagnostics, "f").delete(uri);
    await __classPrivateFieldGet(this, _ValidatorModule_context, "f").connection.sendDiagnostics({ uri, diagnostics: [] });
    __classPrivateFieldGet(this, _ValidatorModule_logger, "f")?.debug('Diagnostics cleared', { uri });
};
ValidatorModule.id = 'validator';
//# sourceMappingURL=validator.js.map