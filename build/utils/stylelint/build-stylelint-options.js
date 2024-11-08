"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildStylelintOptions = buildStylelintOptions;
const path_1 = __importDefault(require("path"));
const path_is_inside_1 = __importDefault(require("path-is-inside"));
const vscode_uri_1 = require("vscode-uri");
const index_1 = require("../packages/index");
/**
 * Given a document URI, base options, and extension options, builds a Stylelint
 * options object. Runner options supersede base options.
 */
async function buildStylelintOptions(uri, workspaceFolder, baseOptions = {}, { config, configFile, configBasedir, customSyntax, ignoreDisables, reportDescriptionlessDisables, reportNeedlessDisables, reportInvalidScopeDisables, } = {}) {
    const options = {
        ...baseOptions,
        config: config ?? baseOptions.config,
        configFile: configFile
            ? workspaceFolder
                ? configFile.replace(/\$\{workspaceFolder\}/gu, workspaceFolder)
                : configFile
            : baseOptions.configFile,
        configBasedir: configBasedir
            ? path_1.default.isAbsolute(configBasedir)
                ? configBasedir
                : path_1.default.join(workspaceFolder ?? '', configBasedir)
            : baseOptions.configBasedir,
        customSyntax: customSyntax
            ? workspaceFolder
                ? customSyntax.replace(/\$\{workspaceFolder\}/gu, workspaceFolder)
                : customSyntax
            : baseOptions.customSyntax,
        ignoreDisables: ignoreDisables ?? baseOptions.ignoreDisables,
        reportDescriptionlessDisables: reportDescriptionlessDisables ?? baseOptions.reportDescriptionlessDisables,
        reportNeedlessDisables: reportNeedlessDisables ?? baseOptions.reportNeedlessDisables,
        reportInvalidScopeDisables: reportInvalidScopeDisables ?? baseOptions.reportInvalidScopeDisables,
    };
    const documentPath = vscode_uri_1.URI.parse(uri).fsPath;
    if (documentPath) {
        if (workspaceFolder && (0, path_is_inside_1.default)(documentPath, workspaceFolder)) {
            options.ignorePath = path_1.default.join(workspaceFolder, '.stylelintignore');
        }
        if (options.ignorePath === undefined) {
            options.ignorePath = path_1.default.join((await (0, index_1.findPackageRoot)(documentPath)) || path_1.default.parse(documentPath).root, '.stylelintignore');
        }
    }
    return options;
}
//# sourceMappingURL=build-stylelint-options.js.map