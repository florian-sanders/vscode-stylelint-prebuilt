"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const node_events_1 = require("node:events");
const node_path_1 = __importDefault(require("node:path"));
const node_1 = require("vscode-languageclient/node");
const vscode_1 = require("vscode");
const types_1 = require("./types");
const index_1 = require("../server/index");
let client;
/**
 * Activates the extension.
 */
async function activate({ subscriptions }) {
    const serverPath = node_path_1.default.join(__dirname, 'start-server.js');
    const api = Object.assign(new node_events_1.EventEmitter(), { codeActionReady: false });
    client = new node_1.LanguageClient('Stylelint', {
        run: {
            module: serverPath,
        },
        debug: {
            module: serverPath,
            options: {
                execArgv: ['--nolazy', '--inspect=6004'],
            },
        },
    }, {
        documentSelector: [{ scheme: 'file' }, { scheme: 'untitled' }],
        diagnosticCollectionName: 'Stylelint',
        synchronize: {
            fileEvents: [
                vscode_1.workspace.createFileSystemWatcher('**/.stylelintrc{,.js,.json,.yaml,.yml}'),
                vscode_1.workspace.createFileSystemWatcher('**/{stylelint.config.js,.stylelintignore}'),
            ],
        },
    });
    const errorHandler = async (error) => {
        await vscode_1.window.showErrorMessage(`Stylelint: ${error instanceof Error ? error.message : String(error)}`);
    };
    const notificationHandlers = () => {
        client.onNotification(index_1.Notification.DidRegisterCodeActionRequestHandler, () => {
            api.codeActionReady = true;
        });
        client.onNotification(index_1.Notification.DidRegisterDocumentFormattingEditProvider, (params) => {
            api.emit(types_1.ApiEvent.DidRegisterDocumentFormattingEditProvider, params);
        });
        client.onNotification(index_1.Notification.DidResetConfiguration, () => {
            api.emit(types_1.ApiEvent.DidResetConfiguration);
        });
    };
    try {
        await client.start();
        notificationHandlers();
    }
    catch (err) {
        await errorHandler(err);
    }
    subscriptions.push(
    // cspell:disable-next-line
    vscode_1.commands.registerCommand('stylelint.executeAutofix', async () => {
        const textEditor = vscode_1.window.activeTextEditor;
        if (!textEditor) {
            return;
        }
        const textDocument = {
            uri: textEditor.document.uri.toString(),
            version: textEditor.document.version,
        };
        const params = {
            command: index_1.CommandId.ApplyAutoFix,
            arguments: [textDocument],
        };
        try {
            await client.sendRequest(node_1.ExecuteCommandRequest.type, params);
        }
        catch {
            await vscode_1.window.showErrorMessage('Failed to apply Stylelint fixes to the document. Please consider opening an issue with steps to reproduce.');
        }
    }));
    subscriptions.push(vscode_1.commands.registerCommand('stylelint.restart', async () => {
        await client.stop();
        try {
            await client.start();
            notificationHandlers();
        }
        catch (error) {
            await errorHandler(error);
        }
    }));
    subscriptions.push(new node_1.SettingMonitor(client, 'stylelint.enable').start());
    return Promise.resolve(api);
}
/**
 * @returns A promise that resolves when the client has been deactivated.
 */
async function deactivate() {
    if (client) {
        try {
            return client.stop();
        }
        catch (err) {
            const msg = err && err ? err.message : 'unknown';
            await vscode_1.window.showErrorMessage(`error stopping stylelint language server: ${msg}`);
            throw err;
        }
    }
}
//# sourceMappingURL=extension.js.map