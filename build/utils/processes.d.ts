import cp from 'child_process';
/**
 * Runs a process and returns the output as read by the given matcher. The
 * matcher is called for each line of the output with the line. The promise
 * returned by this function is resolved to the first value returned by the
 * matcher once the process has exited.
 *
 * If the matcher returns `undefined`, the line is ignored.
 *
 * If the matcher never returns a value, the promise is resolved to `undefined`.
 *
 * If the matcher throws an error, the promise is rejected with the error and
 * an attempt is made to kill the process.
 *
 * If the process exits with a non-zero exit code or if the child process API
 * emits an error, the promise is rejected with the exit code or error.
 * @param command Shell command or path to executable
 * @param args Arguments to pass to the command
 * @param options Options to pass to the spawner
 * @param matcher Function to match the output line
 */
export declare function runProcessFindLine<T>(command: string, args: string[], options: cp.SpawnOptionsWithoutStdio | undefined, matcher: (line: string) => T | undefined): Promise<T | undefined>;
