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
var _CompletionModule_instances, _CompletionModule_context, _CompletionModule_logger, _CompletionModule_shouldComplete, _CompletionModule_onCompletion;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompletionModule = void 0;
const vscode_languageserver_types_1 = require("vscode-languageserver-types");
const index_1 = require("../../utils/documents/index");
const index_2 = require("../../utils/lsp/index");
const index_3 = require("../../utils/stylelint/index");
class CompletionModule {
    constructor({ context, logger }) {
        _CompletionModule_instances.add(this);
        /**
         * The language server context.
         */
        _CompletionModule_context.set(this, void 0);
        /**
         * The logger to use, if any.
         */
        _CompletionModule_logger.set(this, void 0);
        __classPrivateFieldSet(this, _CompletionModule_context, context, "f");
        __classPrivateFieldSet(this, _CompletionModule_logger, logger, "f");
    }
    dispose() {
        __classPrivateFieldGet(this, _CompletionModule_context, "f").connection.onCompletion(() => undefined);
    }
    onInitialize() {
        return {
            capabilities: {
                completionProvider: {},
            },
        };
    }
    onDidRegisterHandlers() {
        __classPrivateFieldGet(this, _CompletionModule_logger, "f")?.debug('Registering onCompletion handler');
        __classPrivateFieldGet(this, _CompletionModule_context, "f").connection.onCompletion(__classPrivateFieldGet(this, _CompletionModule_instances, "m", _CompletionModule_onCompletion).bind(this));
        __classPrivateFieldGet(this, _CompletionModule_logger, "f")?.debug('onCompletion handler registered');
    }
}
exports.CompletionModule = CompletionModule;
_CompletionModule_context = new WeakMap(), _CompletionModule_logger = new WeakMap(), _CompletionModule_instances = new WeakSet(), _CompletionModule_shouldComplete = async function _CompletionModule_shouldComplete(document) {
    const options = await __classPrivateFieldGet(this, _CompletionModule_context, "f").getOptions(document.uri);
    return (options.validate.includes(document.languageId) &&
        options.snippet.includes(document.languageId));
}, _CompletionModule_onCompletion = async function _CompletionModule_onCompletion({ textDocument, position, }) {
    const { uri } = textDocument;
    __classPrivateFieldGet(this, _CompletionModule_logger, "f")?.debug('Received onCompletion', { uri, position });
    const document = __classPrivateFieldGet(this, _CompletionModule_context, "f").documents.get(uri);
    if (!document || !(await __classPrivateFieldGet(this, _CompletionModule_instances, "m", _CompletionModule_shouldComplete).call(this, document))) {
        if (__classPrivateFieldGet(this, _CompletionModule_logger, "f")?.isDebugEnabled()) {
            if (!document) {
                __classPrivateFieldGet(this, _CompletionModule_logger, "f").debug('Unknown document, ignoring', { uri });
            }
            else {
                __classPrivateFieldGet(this, _CompletionModule_logger, "f").debug('Snippets or validation not enabled for language, ignoring', {
                    uri,
                    language: document.languageId,
                });
            }
        }
        return [];
    }
    const validatorModule = __classPrivateFieldGet(this, _CompletionModule_context, "f").getModule('validator');
    const diagnostics = validatorModule?.getDiagnostics(uri);
    if (!diagnostics || diagnostics.length === 0) {
        const items = [
            (0, index_2.createDisableCompletionItem)('stylelint-disable-line'),
            (0, index_2.createDisableCompletionItem)('stylelint-disable-next-line'),
            (0, index_2.createDisableCompletionItem)('stylelint-disable'),
        ];
        __classPrivateFieldGet(this, _CompletionModule_logger, "f")?.debug('No diagnostics for document, returning generic completion items', {
            uri,
            items,
        });
        return items;
    }
    const thisLineRules = new Set();
    const nextLineRules = new Set();
    const disableTable = new index_3.DisableMetadataLookupTable(diagnostics);
    for (const { code, range } of diagnostics) {
        if (!code ||
            typeof code !== 'string' ||
            code === 'CssSyntaxError' ||
            disableTable.find({
                type: index_3.DisableReportRuleNames.Needless,
                rule: code,
                range,
            }).size > 0) {
            continue;
        }
        if (range.start.line === position.line) {
            thisLineRules.add(code);
        }
        else if (range.start.line === position.line + 1) {
            nextLineRules.add(code);
        }
    }
    const results = [];
    const disableType = (0, index_1.getDisableType)(document, position);
    if (disableType === 'stylelint-disable-line') {
        for (const rule of thisLineRules) {
            results.push({
                label: rule,
                kind: vscode_languageserver_types_1.CompletionItemKind.Snippet,
                detail: `disable ${rule} rule. (Stylelint)`,
            });
        }
    }
    else if (disableType === 'stylelint-disable' ||
        disableType === 'stylelint-disable-next-line') {
        for (const rule of nextLineRules) {
            results.push({
                label: rule,
                kind: vscode_languageserver_types_1.CompletionItemKind.Snippet,
                detail: `disable ${rule} rule. (Stylelint)`,
            });
        }
    }
    else {
        results.push((0, index_2.createDisableCompletionItem)('stylelint-disable-line', thisLineRules.size === 1 ? thisLineRules.values().next().value : undefined));
        results.push((0, index_2.createDisableCompletionItem)('stylelint-disable-next-line', nextLineRules.size === 1 ? nextLineRules.values().next().value : undefined));
        results.push((0, index_2.createDisableCompletionItem)('stylelint-disable'));
    }
    __classPrivateFieldGet(this, _CompletionModule_logger, "f")?.debug('Returning completion items', { uri, results });
    return results;
};
CompletionModule.id = 'completion';
//# sourceMappingURL=completion.js.map