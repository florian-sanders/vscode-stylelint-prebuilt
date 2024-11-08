import { CompletionItem } from 'vscode-languageserver-types';
import type { DisableType } from '../documents/index';
/**
 * Creates a disable completion item for the given disable type. Uses the given rule if one is
 * provided, otherwise uses a placeholder.
 */
export declare function createDisableCompletionItem(disableType: DisableType, rule?: string): CompletionItem;
