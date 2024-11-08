"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWorkspaceFolder = getWorkspaceFolder;
const path_is_inside_1 = __importDefault(require("path-is-inside"));
const vscode_uri_1 = require("vscode-uri");
/**
 * Gets the workspace folder for a given document. If the document is an
 * untitled file, then the first open workspace folder is returned.
 * @param connection The language server connection to use to
 * get available workspace folders.
 * @param document The document to get the workspace folder for.
 */
async function getWorkspaceFolder(connection, document) {
    const { scheme, fsPath } = vscode_uri_1.URI.parse(document.uri);
    if (scheme === 'untitled') {
        const uri = (await connection.workspace.getWorkspaceFolders())?.[0]?.uri;
        return uri ? vscode_uri_1.URI.parse(uri).fsPath : undefined;
    }
    if (fsPath) {
        const workspaceFolders = await connection.workspace.getWorkspaceFolders();
        if (workspaceFolders) {
            for (const { uri } of workspaceFolders) {
                const workspacePath = vscode_uri_1.URI.parse(uri).fsPath;
                if ((0, path_is_inside_1.default)(fsPath, workspacePath)) {
                    return workspacePath;
                }
            }
        }
    }
    return undefined;
}
//# sourceMappingURL=get-workspace-folder.js.map