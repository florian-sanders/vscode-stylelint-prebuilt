/**
 * Walks up the file tree from the given path until it finds a directory
 * containing a file named `package.json`. Resolves to `undefined` if no such
 * directory is found.
 * @param startPath The path to start from.
 * @param rootFile The file to use to determine when the project root has been
 * reached. Defaults to `package.json`.
 */
export declare function findPackageRoot(startPath: string, rootFile?: string): Promise<string | undefined>;
