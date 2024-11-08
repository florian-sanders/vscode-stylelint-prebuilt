import { TextEdit } from 'vscode-languageserver-types';
import { TextDocument } from 'vscode-languageserver-textdocument';
/**
 * Creates text edits for a document given updated contents. Allows for
 * retaining the cursor position when the document is updated.
 * @param document The document to create text edits for.
 * @param newContents The new contents of the document.
 * @returns The text edits to apply to the document.
 */
export declare function createTextEdits(document: TextDocument, newContents: string): TextEdit[];
