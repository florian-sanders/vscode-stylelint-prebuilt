import type LSP from 'vscode-languageserver-protocol';
import type { DisableReportRuleNames } from './types';
/**
 * Helps lookup disable reports by type, rule, or range.
 */
export declare class DisableMetadataLookupTable {
    #private;
    /**
     * @param diagnostics The diagnostics to build the lookup table from.
     */
    constructor(diagnostics: LSP.Diagnostic[]);
    /**
     * Finds the reports that match the given type, rule, and range.
     */
    find({ type, rule, range, }: {
        type?: DisableReportRuleNames | string;
        rule?: string;
        range?: LSP.Range;
    }): Set<LSP.Diagnostic>;
}
