import { type ExtensionContext } from 'vscode';
import { PublicApi } from './types';
/**
 * Activates the extension.
 */
export declare function activate({ subscriptions }: ExtensionContext): Promise<PublicApi>;
/**
 * @returns A promise that resolves when the client has been deactivated.
 */
export declare function deactivate(): Promise<void>;
