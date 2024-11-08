import type LSP from 'vscode-languageserver-protocol';
export type FormattingRules = {
    indentation: [number | string];
    'no-missing-end-of-source-newline'?: true | null;
    'no-eol-whitespace'?: true | null;
};
/**
 * Converts the given formatting options to rules.
 * @param options The formatting options.
 * @returns The rules.
 */
export declare function formattingOptionsToRules({ insertSpaces, tabSize, insertFinalNewline, trimTrailingWhitespace, }: LSP.FormattingOptions): FormattingRules;
