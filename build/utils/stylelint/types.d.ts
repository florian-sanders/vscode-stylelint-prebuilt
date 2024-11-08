import type LSP from 'vscode-languageserver-protocol';
import type stylelint from 'stylelint';
import type { PackageManager } from '../packages/index';
export type Stylelint = typeof stylelint;
export type ConfigurationError = Error & {
    code: 78;
};
/**
 * Diagnostics for a lint run.
 */
export type LintDiagnostics = {
    /**
     * The diagnostics, each corresponding to a warning or error emitted by
     * Stylelint.
     */
    diagnostics: LSP.Diagnostic[];
    /**
     * Raw output from Stylelint, if any.
     */
    output?: string;
};
/**
 * Disable report rule names.
 */
export declare enum DisableReportRuleNames {
    Needless = "--report-needless-disables",
    InvalidScope = "--report-invalid-scope-disables",
    Descriptionless = "--report-descriptionless-disables",
    Illegal = "reportDisables"
}
/**
 * Stylelint runner options.
 */
export type RunnerOptions = {
    config?: stylelint.Config | null;
    configBasedir?: string;
    configFile?: string;
    customSyntax?: string;
    ignoreDisables?: boolean;
    packageManager?: PackageManager;
    reportDescriptionlessDisables?: boolean;
    reportInvalidScopeDisables?: boolean;
    reportNeedlessDisables?: boolean;
    snippet?: string[];
    stylelintPath?: string;
    validate?: string[];
};
/**
 * Error thrown when a rule's option is invalid.
 */
export declare class InvalidOptionError extends Error {
    reasons: string[];
    constructor(warnings: {
        text: string;
    }[]);
}
