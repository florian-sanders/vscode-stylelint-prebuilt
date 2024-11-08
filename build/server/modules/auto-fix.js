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
var _AutoFixModule_instances, _AutoFixModule_context, _AutoFixModule_logger, _AutoFixModule_disposables, _AutoFixModule_shouldAutoFix;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutoFixModule = void 0;
const vscode_languageserver_protocol_1 = require("vscode-languageserver-protocol");
const types_1 = require("../types");
class AutoFixModule {
    constructor({ context, logger }) {
        _AutoFixModule_instances.add(this);
        /**
         * The language server context.
         */
        _AutoFixModule_context.set(this, void 0);
        /**
         * The logger to use, if any.
         */
        _AutoFixModule_logger.set(this, void 0);
        /**
         * Disposables for handlers.
         */
        _AutoFixModule_disposables.set(this, []);
        __classPrivateFieldSet(this, _AutoFixModule_context, context, "f");
        __classPrivateFieldSet(this, _AutoFixModule_logger, logger, "f");
    }
    onInitialize() {
        return {
            capabilities: {
                executeCommandProvider: {
                    commands: [types_1.CommandId.ApplyAutoFix],
                },
            },
        };
    }
    dispose() {
        __classPrivateFieldGet(this, _AutoFixModule_disposables, "f").forEach((disposable) => disposable.dispose());
        __classPrivateFieldGet(this, _AutoFixModule_disposables, "f").length = 0;
    }
    onDidRegisterHandlers() {
        __classPrivateFieldGet(this, _AutoFixModule_logger, "f")?.debug('Registering onExecuteCommand handler');
        __classPrivateFieldGet(this, _AutoFixModule_disposables, "f").push(__classPrivateFieldGet(this, _AutoFixModule_context, "f").commands.on(types_1.CommandId.ApplyAutoFix, async ({ arguments: args }) => {
            if (!args) {
                return {};
            }
            const identifier = args[0];
            const uri = identifier.uri;
            const document = __classPrivateFieldGet(this, _AutoFixModule_context, "f").documents.get(uri);
            if (!document || !(await __classPrivateFieldGet(this, _AutoFixModule_instances, "m", _AutoFixModule_shouldAutoFix).call(this, document))) {
                if (__classPrivateFieldGet(this, _AutoFixModule_logger, "f")?.isDebugEnabled()) {
                    if (!document) {
                        __classPrivateFieldGet(this, _AutoFixModule_logger, "f").debug('Unknown document, ignoring', { uri });
                    }
                    else {
                        __classPrivateFieldGet(this, _AutoFixModule_logger, "f").debug('Document should not be auto-fixed, ignoring', {
                            uri,
                            language: document.languageId,
                        });
                    }
                }
                return {};
            }
            if (identifier.version !== document.version) {
                __classPrivateFieldGet(this, _AutoFixModule_logger, "f")?.debug('Document has been modified, ignoring', { uri });
                return {};
            }
            const workspaceChange = new vscode_languageserver_protocol_1.WorkspaceChange();
            const textChange = workspaceChange.getTextEditChange(identifier);
            const edits = await __classPrivateFieldGet(this, _AutoFixModule_context, "f").getFixes(document);
            edits.forEach((edit) => textChange.add(edit));
            __classPrivateFieldGet(this, _AutoFixModule_logger, "f")?.debug('Applying fixes', { uri, edits });
            try {
                const response = await __classPrivateFieldGet(this, _AutoFixModule_context, "f").connection.workspace.applyEdit(workspaceChange.edit);
                if (!response.applied) {
                    __classPrivateFieldGet(this, _AutoFixModule_logger, "f")?.debug('Failed to apply fixes', { uri, response });
                }
            }
            catch (error) {
                __classPrivateFieldGet(this, _AutoFixModule_logger, "f")?.debug('Failed to apply fixes', { uri, error });
            }
            return {};
        }));
    }
}
exports.AutoFixModule = AutoFixModule;
_AutoFixModule_context = new WeakMap(), _AutoFixModule_logger = new WeakMap(), _AutoFixModule_disposables = new WeakMap(), _AutoFixModule_instances = new WeakSet(), _AutoFixModule_shouldAutoFix = async function _AutoFixModule_shouldAutoFix(document) {
    const options = await __classPrivateFieldGet(this, _AutoFixModule_context, "f").getOptions(document.uri);
    return options.validate.includes(document.languageId);
};
AutoFixModule.id = 'auto-fix';
//# sourceMappingURL=auto-fix.js.map