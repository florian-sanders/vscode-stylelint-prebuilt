"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.displayError = displayError;
const iterables_1 = require("../iterables");
/**
 * Takes an error and displays it in the UI using the given connection.
 * @param connection The language server connection.
 * @param err
 */
function displayError(connection, err) {
    if (!(err instanceof Error)) {
        connection.window.showErrorMessage(String(err).replace(/\n/gu, ' '));
        return;
    }
    if ((0, iterables_1.isIterableObject)(err?.reasons)) {
        for (const reason of err.reasons) {
            connection.window.showErrorMessage(`Stylelint: ${reason}`);
        }
        return;
    }
    if (err?.code === 78) {
        connection.window.showErrorMessage(`Stylelint: ${err.message}`);
        return;
    }
    connection.window.showErrorMessage((err.stack || err.message).replace(/\n/gu, ' '));
}
//# sourceMappingURL=display-error.js.map