import type { Connection } from 'vscode-languageserver';
import type { TextDocument } from 'vscode-languageserver-textdocument';
/**
 * Gets the workspace folder for a given document. If the document is an
 * untitled file, then the first open workspace folder is returned.
 * @param connection The language server connection to use to
 * get available workspace folders.
 * @param document The document to get the workspace folder for.
 */
export declare function getWorkspaceFolder(connection: Connection, document: TextDocument): Promise<string | undefined>;
