"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const global_middleware_1 = require("./middlewares/global.middleware");
const error_config_1 = require("./config/error.config");
const proccessHandler_config_1 = require("./config/proccessHandler.config");
const env_config_1 = __importDefault(require("./config/env.config"));
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const routes_1 = require("./middlewares/routes");
// Create Express app
const app = (0, app_1.createExpressApp)();
app.use('/uploads', express_1.default.static(path_1.default.join(process.cwd(), 'public', 'uploads')));
app.use('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        environment: env_config_1.default.NODE_ENV,
    });
});
// Apply middleware
(0, global_middleware_1.applyMiddleware)(app);
// Configure routes
(0, routes_1.configureRoutes)(app);
// Configure error handling (must be after routes)
(0, error_config_1.configureErrorHandling)(app);
// Configure process handlers
(0, proccessHandler_config_1.configureProcessHandlers)();
// Start server
(0, app_1.startServer)(app, app_1.port);
//# sourceMappingURL=server.js.map