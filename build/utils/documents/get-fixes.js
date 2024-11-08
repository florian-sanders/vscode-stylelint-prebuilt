"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFixes = getFixes;
const create_text_edits_1 = require("./create-text-edits");
/**
 * Runs Stylelint and returns fix text edits for the given document.
 * @param runner The Stylelint runner.
 * @param document The document to get fixes for.
 * @param linterOptions Linter options to use.
 * @param runnerOptions The runner options.
 */
async function getFixes(runner, document, linterOptions = {}, runnerOptions = {}) {
    const result = await runner.lintDocument(document, { ...linterOptions, fix: true }, runnerOptions);
    return typeof result.output === 'string' ? (0, create_text_edits_1.createTextEdits)(document, result.output) : [];
}
//# sourceMappingURL=get-fixes.js.map