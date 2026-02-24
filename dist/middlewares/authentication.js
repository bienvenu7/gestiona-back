"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPermitted = exports.isAuhenticated = void 0;
const env_config_1 = __importDefault(require("../config/env.config"));
const app_error_1 = require("../utils/app.error");
const jwt_config_1 = require("../config/jwt.config");
const isAuhenticated = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
        return next(new app_error_1.AppError("Vous n'êtes pas autorisé!", 401));
    }
    const token = authHeader.replace('Bearer ', '');
    try {
        const payload = (0, jwt_config_1.verifyToken)(token, env_config_1.default.JWT_SECRET);
        req.user = payload;
        next();
    }
    catch {
        return next(new app_error_1.AppError("Votre clé d'authentification n'est pas valide", 401));
    }
};
exports.isAuhenticated = isAuhenticated;
const isPermitted = async (req, res, next) => {
    const { role } = req.user;
    const requireRoles = ['OWNER', 'STAFF'];
    if (!requireRoles.includes(role)) {
        return next(new app_error_1.AppError("Vous n'êtes pas autorisé à éfectué cette tache!", 401));
    }
    next();
};
exports.isPermitted = isPermitted;
//# sourceMappingURL=authentication.js.map