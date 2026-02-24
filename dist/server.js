"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
const app_1 = require("./app");
const global_middleware_1 = require("./middlewares/global.middleware");
const error_config_1 = require("./config/error.config");
const proccessHandler_config_1 = require("./config/proccessHandler.config");
const env_config_1 = __importDefault(require("./config/env.config"));
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const routes_1 = require("./middlewares/routes");
const db_config_1 = require("./config/db.config");
const socket_io_1 = require("socket.io");
const jwt_config_1 = require("./config/jwt.config");
console.log('DATABASE_URL =', process.env.DATABASE_URL);
console.log('JWT_SECRET =', process.env.JWT_SECRET);
console.log('JWT_REFRESH_SECRET =', process.env.JWT_REFRESH_SECRET);
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
// Configure db error handling
app.use(db_config_1.prismaErrorHandler);
// Configure process handlers
(0, proccessHandler_config_1.configureProcessHandlers)();
// Configure error handling (must be after routes)
(0, error_config_1.configureErrorHandling)(app);
//create http server
const server = (0, app_1.createHttpServer)(app);
//create io variable
exports.io = new socket_io_1.Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        credentials: true,
        optionsSuccessStatus: 200,
    },
});
exports.io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    const decoded = (0, jwt_config_1.verifyToken)(token, env_config_1.default.JWT_SECRET);
    socket.userId = decoded.userId;
    socket.companyId = decoded.companyId;
    next();
});
exports.io.on('connection', socket => {
    const companyRoom = socket.companyId;
    console.log(`User ${socket.userId} joined ${companyRoom}`);
    socket.join(companyRoom);
});
// Start server
(0, app_1.startServer)(server, app_1.port);
//# sourceMappingURL=server.js.map