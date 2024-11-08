"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formattingOptionsToRules = formattingOptionsToRules;
/**
 * Converts the given formatting options to rules.
 * @param options The formatting options.
 * @returns The rules.
 */
function formattingOptionsToRules({ insertSpaces, tabSize, insertFinalNewline, trimTrailingWhitespace, }) {
    // NOTE: There is no equivalent rule for trimFinalNewlines, so it is not respected.
    // TODO: Create respective rule upstream?
    const rules = {
        indentation: [insertSpaces ? tabSize : 'tab'],
    };
    if (insertFinalNewline !== undefined) {
        rules['no-missing-end-of-source-newline'] = insertFinalNewline || null;
    }
    if (trimTrailingWhitespace !== undefined) {
        rules['no-eol-whitespace'] = trimTrailingWhitespace || null;
    }
    return rules;
}
//# sourceMappingURL=formatting-options-to-rules.js.map