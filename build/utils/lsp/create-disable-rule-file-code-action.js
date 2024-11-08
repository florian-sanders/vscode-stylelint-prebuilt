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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDisableRuleFileCodeAction = createDisableRuleFileCodeAction;
const os_1 = __importDefault(require("os"));
const LSP = __importStar(require("vscode-languageserver-protocol"));
/**
 * Creates a code action that disables a rule for an entire file.
 * @param document The document to apply the code action to.
 * @param diagnostic The diagnostic corresponding to the rule to disable.
 */
function createDisableRuleFileCodeAction(document, { code }) {
    const workspaceChange = new LSP.WorkspaceChange();
    const shebang = document.getText(LSP.Range.create(LSP.Position.create(0, 0), LSP.Position.create(0, 2)));
    workspaceChange
        .getTextEditChange(document)
        .add(LSP.TextEdit.insert(LSP.Position.create(shebang === '#!' ? 1 : 0, 0), `/* stylelint-disable ${code} */${os_1.default.EOL}`));
    return LSP.CodeAction.create(`Disable ${code} for the entire file`, workspaceChange.edit, LSP.CodeActionKind.QuickFix);
}
//# sourceMappingURL=create-disable-rule-file-code-action.js.map