"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDisableCompletionItem = createDisableCompletionItem;
const vscode_languageserver_types_1 = require("vscode-languageserver-types");
/**
 * Creates a disable completion item for the given disable type. Uses the given rule if one is
 * provided, otherwise uses a placeholder.
 */
function createDisableCompletionItem(disableType, rule = '') {
    const item = vscode_languageserver_types_1.CompletionItem.create(disableType);
    item.kind = vscode_languageserver_types_1.CompletionItemKind.Snippet;
    item.insertTextFormat = vscode_languageserver_types_1.InsertTextFormat.Snippet;
    if (disableType === 'stylelint-disable') {
        item.insertText = `/* stylelint-disable \${0:${rule || 'rule'}} */\n/* stylelint-enable \${0:${rule || 'rule'}} */`;
        item.detail =
            'Turn off all Stylelint or individual rules, after which you do not need to re-enable Stylelint. (Stylelint)';
        item.documentation = {
            kind: vscode_languageserver_types_1.MarkupKind.Markdown,
            value: `\`\`\`css\n/* stylelint-disable ${rule || 'rule'} */\n/* stylelint-enable ${rule || 'rule'} */\n\`\`\``,
        };
    }
    else {
        item.insertText = `/* ${disableType} \${0:${rule || 'rule'}} */`;
        item.detail =
            disableType === 'stylelint-disable-line'
                ? 'Turn off Stylelint rules for individual lines only, after which you do not need to explicitly re-enable them. (Stylelint)'
                : 'Turn off Stylelint rules for the next line only, after which you do not need to explicitly re-enable them. (Stylelint)';
        item.documentation = {
            kind: vscode_languageserver_types_1.MarkupKind.Markdown,
            value: `\`\`\`css\n/* ${disableType} ${rule || 'rule'} */\n\`\`\``,
        };
    }
    return item;
}
//# sourceMappingURL=create-disable-completion-item.js.map