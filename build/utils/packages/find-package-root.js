"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findPackageRoot = findPackageRoot;
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
/**
 * Walks up the file tree from the given path until it finds a directory
 * containing a file named `package.json`. Resolves to `undefined` if no such
 * directory is found.
 * @param startPath The path to start from.
 * @param rootFile The file to use to determine when the project root has been
 * reached. Defaults to `package.json`.
 */
async function findPackageRoot(startPath, rootFile = 'package.json') {
    let currentDirectory = startPath;
    // eslint-disable-next-line no-constant-condition
    while (true) {
        const manifestPath = path_1.default.join(currentDirectory, rootFile);
        try {
            const stat = await promises_1.default.stat(manifestPath);
            if (stat.isFile()) {
                return currentDirectory;
            }
            const parent = path_1.default.dirname(currentDirectory);
            if (!path_1.default.relative(parent, currentDirectory)) {
                return undefined;
            }
            currentDirectory = parent;
        }
        catch (error) {
            if (error.code === 'ENOENT' ||
                error.code === 'ENOTDIR') {
                const parent = path_1.default.dirname(currentDirectory);
                if (!path_1.default.relative(parent, currentDirectory)) {
                    return undefined;
                }
                currentDirectory = parent;
            }
            else {
                throw error;
            }
        }
    }
}
//# sourceMappingURL=find-package-root.js.map