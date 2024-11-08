"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _StylelintRunner_connection, _StylelintRunner_logger, _StylelintRunner_stylelintResolver;
Object.defineProperty(exports, "__esModule", { value: true });
exports.StylelintRunner = void 0;
const os_1 = __importDefault(require("os"));
const vscode_uri_1 = require("vscode-uri");
const index_1 = require("../packages/index");
const index_2 = require("../documents/index");
const process_linter_result_1 = require("./process-linter-result");
const build_stylelint_options_1 = require("./build-stylelint-options");
/**
 * Runs Stylelint in VS Code.
 */
class StylelintRunner {
    constructor(connection, logger, resolver) {
        /**
         * The language server connection.
         */
        _StylelintRunner_connection.set(this, void 0);
        /**
         * The logger to use, if any.
         */
        _StylelintRunner_logger.set(this, void 0);
        /**
         * The Stylelint resolver.
         */
        _StylelintRunner_stylelintResolver.set(this, void 0);
        __classPrivateFieldSet(this, _StylelintRunner_connection, connection, "f");
        __classPrivateFieldSet(this, _StylelintRunner_logger, logger, "f");
        __classPrivateFieldSet(this, _StylelintRunner_stylelintResolver, resolver ?? new index_1.StylelintResolver(connection, logger), "f");
    }
    /**
     * Lints the given document using Stylelint. The linting result is then
     * converted to LSP diagnostics and returned.
     * @param document
     * @param linterOptions
     * @param extensionOptions
     */
    async lintDocument(document, linterOptions = {}, runnerOptions = {}) {
        const workspaceFolder = __classPrivateFieldGet(this, _StylelintRunner_connection, "f") && (await (0, index_2.getWorkspaceFolder)(__classPrivateFieldGet(this, _StylelintRunner_connection, "f"), document));
        const result = await __classPrivateFieldGet(this, _StylelintRunner_stylelintResolver, "f").resolve(runnerOptions, document);
        if (!result) {
            __classPrivateFieldGet(this, _StylelintRunner_logger, "f")?.info('No Stylelint found with which to lint document', {
                uri: document.uri,
                options: runnerOptions,
            });
            return { diagnostics: [] };
        }
        const { stylelint } = result;
        const { fsPath } = vscode_uri_1.URI.parse(document.uri);
        // Workaround for Stylelint treating paths as case-sensitive on Windows
        // If the drive letter is lowercase, we need to convert it to uppercase
        // See https://github.com/stylelint/stylelint/issues/5594
        // TODO: Remove once fixed upstream
        const codeFilename = os_1.default.platform() === 'win32'
            ? fsPath.replace(/^[a-z]:/, (match) => match.toUpperCase())
            : fsPath;
        const options = {
            ...(await (0, build_stylelint_options_1.buildStylelintOptions)(document.uri, workspaceFolder, linterOptions, runnerOptions)),
            code: document.getText(),
            formatter: () => '',
        };
        if (codeFilename) {
            options.codeFilename = codeFilename;
        }
        else if (!linterOptions?.config?.rules) {
            options.config = { rules: {} };
        }
        if (__classPrivateFieldGet(this, _StylelintRunner_logger, "f")?.isDebugEnabled()) {
            __classPrivateFieldGet(this, _StylelintRunner_logger, "f")?.debug('Running Stylelint', { options: { ...options, code: '...' } });
        }
        try {
            return (0, process_linter_result_1.processLinterResult)(stylelint, await stylelint.lint(options));
        }
        catch (err) {
            if (err instanceof Error &&
                (err.message.startsWith('No configuration provided for') ||
                    err.message.includes('No rules found within configuration'))) {
                // Check only CSS syntax errors without applying any Stylelint rules
                return (0, process_linter_result_1.processLinterResult)(stylelint, await stylelint.lint({ ...options, config: { rules: {} } }));
            }
            throw err;
        }
    }
}
exports.StylelintRunner = StylelintRunner;
_StylelintRunner_connection = new WeakMap(), _StylelintRunner_logger = new WeakMap(), _StylelintRunner_stylelintResolver = new WeakMap();
//# sourceMappingURL=stylelint-runner.js.map