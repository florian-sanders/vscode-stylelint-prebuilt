"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFirstReturnValue = getFirstReturnValue;
exports.getFirstResolvedValue = getFirstResolvedValue;
/**
 * Runs each function, passing the result of the first function return
 * a value that is not `undefined`. Any subsequent functions are not run.
 */
function getFirstReturnValue(...functions) {
    for (const func of functions) {
        const result = func();
        if (result !== undefined) {
            return result;
        }
    }
    return undefined;
}
/**
 * Runs each async function, passing the resolved value of the first function
 * that resolves to a value that is not `undefined`. Any subsequent functions
 * are not run.
 */
async function getFirstResolvedValue(...functions) {
    for (const func of functions) {
        const result = await func();
        if (result !== undefined) {
            return result;
        }
    }
    return undefined;
}
//# sourceMappingURL=get-first-return-value.js.map