import { Position } from 'vscode-languageserver-types';
import type { TextDocument } from 'vscode-languageserver-textdocument';
/**
 * Disable directive comment types.
 */
export type DisableType = 'stylelint-disable' | 'stylelint-disable-line' | 'stylelint-disable-next-line';
/**
 * If the given position is inside a `stylelint-disable` after the comment'
 * type, returns the disable comment's type. Otherwise, returns `undefined`.
 *
 * @example
 * ```js
 * const document = TextDocument.create(
 *   'file:///path/to/file.css',
 *   'css',
 *   1,
 *   '/* stylelint-disable-line indentation *\/'
 *   //                         ^ Position is here
 * );
 * const position = Position.create(0, 26);
 *
 * getDisableType(document, position);
 * // => 'stylelint-disable-line'
 * ```
 */
export declare function getDisableType(document: TextDocument, position: Position): DisableType | undefined;
