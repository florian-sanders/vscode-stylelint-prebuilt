"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const process_1 = __importDefault(require("process"));
const node_1 = require("vscode-languageserver/node");
const index_1 = require("../server/index");
const connection = (0, node_1.createConnection)(node_1.ProposedFeatures.all);
const { NODE_ENV } = process_1.default.env;
const logger = NODE_ENV === 'development'
    ? (0, index_1.createLogger)(connection, 'debug', path_1.default.join(__dirname, '../stylelint-language-server.log'))
    : (0, index_1.createLogger)(connection, 'info');
const server = new index_1.StylelintLanguageServer({
    connection,
    logger,
    modules: Object.values(index_1.modules),
});
server.start();
//# sourceMappingURL=start-server.js.map