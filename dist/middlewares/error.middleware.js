"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotFoundError = exports.validateRequest = exports.errorHandler = void 0;
const zod_1 = require("zod");
const app_error_1 = require("../utils/app.error");
const errorHandler = (err, req, res, next) => {
    let statusCode = 500;
    let message = "Une erreur inconnue s'est produite. Merci d'être patient!";
    let errors = undefined;
    if (err instanceof app_error_1.AppError) {
        statusCode = err.statusCode;
        message = err.message;
        errors = err.errors;
    }
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message,
        errors,
        path: req.originalUrl,
        timestamp: new Date().toISOString(),
    });
};
exports.errorHandler = errorHandler;
const validateRequest = (schemas) => (req, res, next) => {
    try {
        schemas.body?.parse(req.body);
        schemas.query?.parse(req.query);
        schemas.params?.parse(req.params);
        next();
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            const errors = error.issues.map(err => ({
                field: err.path.join('.'),
                message: err.message,
            }));
            return next(new app_error_1.AppError('Erreur de validation!', 400, errors));
        }
        next(new app_error_1.AppError("Une erreur s'est produite!", 500));
    }
};
exports.validateRequest = validateRequest;
const NotFoundError = (req, res) => {
    return res.status(404).json({
        success: false,
        statusCode: 404,
        message: 'Url inexistant',
        path: req.originalUrl,
        timestamp: new Date().toISOString(),
    });
};
exports.NotFoundError = NotFoundError;
//# sourceMappingURL=error.middleware.js.map