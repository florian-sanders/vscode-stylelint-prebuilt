import type stylelint from 'stylelint';
import type { RunnerOptions } from './types';
/**
 * Given a document URI, base options, and extension options, builds a Stylelint
 * options object. Runner options supersede base options.
 */
export declare function buildStylelintOptions(uri: string, workspaceFolder?: string, baseOptions?: Partial<stylelint.LinterOptions>, { config, configFile, configBasedir, customSyntax, ignoreDisables, reportDescriptionlessDisables, reportNeedlessDisables, reportInvalidScopeDisables, }?: RunnerOptions): Promise<Partial<stylelint.LinterOptions>>;
