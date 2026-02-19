"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startServer = exports.createExpressApp = exports.port = void 0;
exports.getPortFromArgs = getPortFromArgs;
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Get port from command line arguments or environment
function getPortFromArgs() {
    const portArg = process.argv.find(arg => arg.startsWith('--port='));
    if (portArg) {
        return parseInt(portArg.split('=')[1]);
    }
    return null;
}
exports.port = getPortFromArgs() || parseInt(process.env.PORT || '7001');
// Create Express app
const createExpressApp = () => {
    const app = (0, express_1.default)();
    // Set view engine to EJS
    app.set('view engine', 'ejs');
    // Set views directory (dist path)
    app.set('views', path_1.default.join(__dirname, '..', 'utils', 'email'));
    return app;
};
exports.createExpressApp = createExpressApp;
// Start server
const startServer = (server, port) => {
    server.listen(port, () => {
        if (process.env.NODE_ENV === 'production') {
            console.log(`Server is running on production`);
        }
        else {
            console.log(`Server is running at http://localhost:${port}`);
        }
    });
};
exports.startServer = startServer;
//# sourceMappingURL=app.js.map