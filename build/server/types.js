"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Notification = exports.CodeActionKind = exports.CommandId = void 0;
const vscode_languageserver_types_1 = require("vscode-languageserver-types");
/**
 * Command IDs
 */
var CommandId;
(function (CommandId) {
    CommandId["ApplyAutoFix"] = "stylelint.applyAutoFix";
    CommandId["OpenRuleDoc"] = "stylelint.openRuleDoc";
})(CommandId || (exports.CommandId = CommandId = {}));
/**
 * Code action kinds
 */
exports.CodeActionKind = {
    StylelintSourceFixAll: `${vscode_languageserver_types_1.CodeActionKind.SourceFixAll}.stylelint`,
};
/**
 * Language server notification names.
 */
var Notification;
(function (Notification) {
    Notification["DidRegisterCodeActionRequestHandler"] = "stylelint/didRegisterCodeActionRequestHandler";
    Notification["DidRegisterDocumentFormattingEditProvider"] = "stylelint/didRegisterDocumentFormattingEditProvider";
    Notification["DidResetConfiguration"] = "stylelint/didResetConfiguration";
})(Notification || (exports.Notification = Notification = {}));
//# sourceMappingURL=types.js.map