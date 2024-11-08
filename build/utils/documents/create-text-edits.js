"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTextEdits = createTextEdits;
const fast_diff_1 = __importDefault(require("fast-diff"));
const vscode_languageserver_types_1 = require("vscode-languageserver-types");
/**
 * Creates text edits for a document given updated contents. Allows for
 * retaining the cursor position when the document is updated.
 * @param document The document to create text edits for.
 * @param newContents The new contents of the document.
 * @returns The text edits to apply to the document.
 */
function createTextEdits(document, newContents) {
    const diffs = (0, fast_diff_1.default)(document.getText(), newContents);
    const edits = [];
    let offset = 0;
    for (const [op, text] of diffs) {
        const start = offset;
        switch (op) {
            case fast_diff_1.default.EQUAL:
                offset += text.length;
                break;
            case fast_diff_1.default.DELETE:
                offset += text.length;
                edits.push(vscode_languageserver_types_1.TextEdit.del(vscode_languageserver_types_1.Range.create(document.positionAt(start), document.positionAt(offset))));
                break;
            case fast_diff_1.default.INSERT:
                edits.push(vscode_languageserver_types_1.TextEdit.insert(document.positionAt(start), text));
                break;
        }
    }
    return edits;
}
//# sourceMappingURL=create-text-edits.js.map