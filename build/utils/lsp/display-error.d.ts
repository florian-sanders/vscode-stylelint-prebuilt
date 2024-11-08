import type { Connection } from 'vscode-languageserver';
/**
 * Takes an error and displays it in the UI using the given connection.
 * @param connection The language server connection.
 * @param err
 */
export declare function displayError(connection: Connection, err: unknown): void;
