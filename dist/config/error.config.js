"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configureErrorHandling = void 0;
const error_middleware_1 = require("../middlewares/error.middleware");
const configureErrorHandling = (app) => {
    // 404 handler - must be after all routes
    app.use('*', (req, res, next) => {
        next((0, error_middleware_1.NotFoundError)(req, res));
    });
    // Global error handler
    app.use(error_middleware_1.errorHandler);
};
exports.configureErrorHandling = configureErrorHandling;
//# sourceMappingURL=error.config.js.map