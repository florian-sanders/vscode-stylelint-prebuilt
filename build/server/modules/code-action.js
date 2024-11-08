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
var _CodeActionModule_instances, _CodeActionModule_context, _CodeActionModule_logger, _CodeActionModule_disposables, _CodeActionModule_shouldCodeAction, _CodeActionModule_getAutoFixAllAction, _CodeActionModule_getAutoFixAllCommandAction, _CodeActionModule_getOpenRuleDocAction, _CodeActionModule_getCodeActions;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeActionModule = void 0;
const LSP = __importStar(require("vscode-languageserver-protocol"));
const types_1 = require("../types");
const index_1 = require("../../utils/lsp/index");
const index_2 = require("../../utils/stylelint/index");
class CodeActionModule {
    constructor({ context, logger }) {
        _CodeActionModule_instances.add(this);
        /**
         * The language server context.
         */
        _CodeActionModule_context.set(this, void 0);
        /**
         * The logger to use, if any.
         */
        _CodeActionModule_logger.set(this, void 0);
        /**
         * Disposables for notification and command handlers.
         */
        _CodeActionModule_disposables.set(this, []);
        __classPrivateFieldSet(this, _CodeActionModule_context, context, "f");
        __classPrivateFieldSet(this, _CodeActionModule_logger, logger, "f");
    }
    dispose() {
        __classPrivateFieldGet(this, _CodeActionModule_disposables, "f").forEach((disposable) => disposable.dispose());
        __classPrivateFieldGet(this, _CodeActionModule_disposables, "f").length = 0;
        __classPrivateFieldGet(this, _CodeActionModule_context, "f").connection.onCodeAction(() => undefined);
    }
    onInitialize() {
        return {
            capabilities: {
                codeActionProvider: {
                    codeActionKinds: [
                        LSP.CodeActionKind.QuickFix,
                        types_1.CodeActionKind.StylelintSourceFixAll,
                    ],
                },
                executeCommandProvider: {
                    commands: [types_1.CommandId.OpenRuleDoc],
                },
            },
        };
    }
    onDidRegisterHandlers() {
        __classPrivateFieldGet(this, _CodeActionModule_logger, "f")?.debug('Registering onCodeAction handler');
        __classPrivateFieldGet(this, _CodeActionModule_context, "f").connection.onCodeAction(async ({ context, textDocument: { uri } }) => {
            __classPrivateFieldGet(this, _CodeActionModule_logger, "f")?.debug('Received onCodeAction', { context, uri });
            const document = __classPrivateFieldGet(this, _CodeActionModule_context, "f").documents.get(uri);
            if (!document) {
                __classPrivateFieldGet(this, _CodeActionModule_logger, "f")?.debug('Unknown document, ignoring', { uri });
                return [];
            }
            if (!(await __classPrivateFieldGet(this, _CodeActionModule_instances, "m", _CodeActionModule_shouldCodeAction).call(this, document))) {
                __classPrivateFieldGet(this, _CodeActionModule_logger, "f")?.debug('Document should not be validated, ignoring', {
                    uri,
                    language: document.languageId,
                });
                return [];
            }
            const actions = await __classPrivateFieldGet(this, _CodeActionModule_instances, "m", _CodeActionModule_getCodeActions).call(this, document, context);
            __classPrivateFieldGet(this, _CodeActionModule_logger, "f")?.debug('Returning code actions', { actions });
            return actions;
        });
        __classPrivateFieldGet(this, _CodeActionModule_logger, "f")?.debug('onCodeAction handler registered');
        __classPrivateFieldGet(this, _CodeActionModule_disposables, "f").push(__classPrivateFieldGet(this, _CodeActionModule_context, "f").commands.on(types_1.CommandId.OpenRuleDoc, async ({ arguments: args }) => {
            const params = args?.[0];
            if (!params) {
                __classPrivateFieldGet(this, _CodeActionModule_logger, "f")?.debug('No URL provided, ignoring command request');
                return {};
            }
            const { uri } = params;
            __classPrivateFieldGet(this, _CodeActionModule_logger, "f")?.debug('Opening rule documentation', { uri });
            // Open URL in browser
            const showURIResponse = await __classPrivateFieldGet(this, _CodeActionModule_context, "f").connection.window.showDocument({
                uri,
                external: true,
            });
            if (!showURIResponse.success) {
                __classPrivateFieldGet(this, _CodeActionModule_logger, "f")?.warn('Failed to open rule documentation', { uri });
                return new LSP.ResponseError(LSP.ErrorCodes.InternalError, 'Failed to open rule documentation');
            }
            return {};
        }));
        __classPrivateFieldGet(this, _CodeActionModule_disposables, "f").push(__classPrivateFieldGet(this, _CodeActionModule_context, "f").notifications.on(LSP.InitializedNotification.type, () => __classPrivateFieldGet(this, _CodeActionModule_context, "f").connection.sendNotification(types_1.Notification.DidRegisterCodeActionRequestHandler)));
    }
}
exports.CodeActionModule = CodeActionModule;
_CodeActionModule_context = new WeakMap(), _CodeActionModule_logger = new WeakMap(), _CodeActionModule_disposables = new WeakMap(), _CodeActionModule_instances = new WeakSet(), _CodeActionModule_shouldCodeAction = async function _CodeActionModule_shouldCodeAction(document) {
    const options = await __classPrivateFieldGet(this, _CodeActionModule_context, "f").getOptions(document.uri);
    return options.validate.includes(document.languageId);
}, _CodeActionModule_getAutoFixAllAction = async function _CodeActionModule_getAutoFixAllAction(document) {
    const edits = await __classPrivateFieldGet(this, _CodeActionModule_context, "f").getFixes(document);
    const identifier = { uri: document.uri, version: document.version };
    return edits.length > 0
        ? LSP.CodeAction.create('Fix all Stylelint auto-fixable problems', { documentChanges: [LSP.TextDocumentEdit.create(identifier, edits)] }, types_1.CodeActionKind.StylelintSourceFixAll)
        : undefined;
}, _CodeActionModule_getAutoFixAllCommandAction = function _CodeActionModule_getAutoFixAllCommandAction(document) {
    const command = LSP.Command.create('Fix all Stylelint auto-fixable problems', types_1.CommandId.ApplyAutoFix, { uri: document.uri, version: document.version });
    return LSP.CodeAction.create('Fix all Stylelint auto-fixable problems', command, LSP.CodeActionKind.Source);
}, _CodeActionModule_getOpenRuleDocAction = function _CodeActionModule_getOpenRuleDocAction({ code, codeDescription }) {
    const uri = codeDescription?.href;
    if (!uri) {
        return undefined;
    }
    const command = LSP.Command.create(`Open documentation for ${code}`, types_1.CommandId.OpenRuleDoc, {
        uri,
    });
    return LSP.CodeAction.create(`Show documentation for ${code}`, command, LSP.CodeActionKind.QuickFix);
}, _CodeActionModule_getCodeActions = async function _CodeActionModule_getCodeActions(document, context) {
    const only = context.only && new Set(context.only);
    __classPrivateFieldGet(this, _CodeActionModule_logger, "f")?.debug('Creating code actions', { only: context.only });
    // If asked to provide source or source-fix-all actions, only provide
    // actions for the whole document.
    if (only?.has(LSP.CodeActionKind.SourceFixAll) ||
        only?.has(types_1.CodeActionKind.StylelintSourceFixAll)) {
        __classPrivateFieldGet(this, _CodeActionModule_logger, "f")?.debug('Creating "source-fix-all" code action');
        const action = await __classPrivateFieldGet(this, _CodeActionModule_instances, "m", _CodeActionModule_getAutoFixAllAction).call(this, document);
        return action ? [action] : [];
    }
    if (only?.has(LSP.CodeActionKind.Source)) {
        __classPrivateFieldGet(this, _CodeActionModule_logger, "f")?.debug('Creating "source" code action');
        return [__classPrivateFieldGet(this, _CodeActionModule_instances, "m", _CodeActionModule_getAutoFixAllCommandAction).call(this, document)];
    }
    if (only && !only.has(LSP.CodeActionKind.QuickFix)) {
        __classPrivateFieldGet(this, _CodeActionModule_logger, "f")?.debug('No quick fix actions requested, skipping action creation');
        return [];
    }
    // Otherwise, provide specific actions for each problem.
    const actions = new index_1.RuleCodeActionsCollection();
    for (const diagnostic of context.diagnostics) {
        const { source, code } = diagnostic;
        // If the diagnostic is not from Stylelint, ignore it.
        if (source !== 'Stylelint' || typeof code !== 'string') {
            continue;
        }
        // If the diagnostic is for a disable report, don't create disable
        // rule actions. Creating disable rule actions for an invalid
        // disable wouldn't make any sense.
        if (!(0, index_2.isDisableReportRule)(code)) {
            const options = await __classPrivateFieldGet(this, _CodeActionModule_context, "f").getOptions(document.uri);
            const { location } = options.codeAction.disableRuleComment;
            __classPrivateFieldGet(this, _CodeActionModule_logger, "f")?.debug('Creating disable rule for line code action', { rule: code, location });
            actions.get(code).disableLine = (0, index_1.createDisableRuleLineCodeAction)(document, diagnostic, location);
            if (!actions.get(code).disableFile) {
                __classPrivateFieldGet(this, _CodeActionModule_logger, "f")?.debug('Creating disable rule for file code action', { rule: code });
                actions.get(code).disableFile = (0, index_1.createDisableRuleFileCodeAction)(document, diagnostic);
            }
        }
        if (!actions.get(code).documentation) {
            __classPrivateFieldGet(this, _CodeActionModule_logger, "f")?.debug('Creating documentation code action', { rule: code });
            actions.get(code).documentation = __classPrivateFieldGet(this, _CodeActionModule_instances, "m", _CodeActionModule_getOpenRuleDocAction).call(this, diagnostic);
        }
    }
    return [...actions];
};
CodeActionModule.id = 'code-action';
//# sourceMappingURL=code-action.js.map