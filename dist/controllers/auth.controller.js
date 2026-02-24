"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logoutUser = exports.refrehToken = exports.getUser = exports.loginUser = void 0;
const company_schema_1 = require("../schema/company.schema");
const db_config_1 = require("../config/db.config");
const otp_1 = require("../utils/otp");
const app_error_1 = require("../utils/app.error");
const mailer_config_1 = require("../config/mailer.config");
const jwt_config_1 = require("../config/jwt.config");
const logger_1 = require("../utils/logger");
const jsonwebtoken_1 = require("jsonwebtoken");
const env_config_1 = require("../config/env.config");
const loginUser = async (req, res, next) => {
    const { email, password } = company_schema_1.loginUserSchema.parse(req.body);
    const hashPassword = (0, otp_1.hashOtp)(password);
    const foundUser = await db_config_1.prisma.user.findUnique({
        where: {
            email,
            password: hashPassword,
        },
        select: {
            name: true,
            email: true,
            role: true,
        },
    });
    if (!foundUser) {
        return next(new app_error_1.AppError("Le mot de passse ou l'addresse email ne corresponds pas.", 403));
    }
    const otp = (0, otp_1.generateOtp)();
    const hash = (0, otp_1.hashOtp)(otp);
    logger_1.logger.info(otp);
    const createOtp = await db_config_1.prisma.otp.create({
        data: {
            hash,
            target: email,
            expiredAt: (0, jwt_config_1.expiredAtFunc)(1 * 60 * 1000),
        },
        select: {
            id: true,
        },
    });
    const sendOtp = await (0, mailer_config_1.sendHash)(otp, email);
    if (sendOtp === 'failed') {
        await db_config_1.prisma.otp.delete({
            where: {
                id: createOtp.id,
            },
        });
        return next(new app_error_1.AppError("Impossible d'envoyer l'addresse de confirmation via votre addresse email", 403));
    }
    return res.status(200).json({
        message: "Vous aviez reçu un email de confirmation veillez s'il vous plait le saisir.",
    });
};
exports.loginUser = loginUser;
const getUser = async (req, res, next) => {
    const user_id = req.user?.userId;
    if (!user_id) {
        return next(new app_error_1.AppError("Vous n'êtes pas autorisé!", 403));
    }
    const user = await db_config_1.prisma.user.findUnique({
        where: {
            id: user_id,
        },
        select: {
            id: true,
            email: true,
            role: true,
            name: true,
            company: {
                select: {
                    id: true,
                    name: true,
                },
            },
        },
    });
    if (!user) {
        return next(new app_error_1.AppError("Aucun utilisateur n'a été trouvé avec ces coordonnées", 403));
    }
    return res.status(200).json(user);
};
exports.getUser = getUser;
const refrehToken = async (req, res, next) => {
    const refreshToken = req.cookies.refresh;
    if (!refreshToken) {
        return next(new app_error_1.AppError("Vous n'êtes authentifié", 401));
    }
    const payload = (0, jsonwebtoken_1.verify)(refreshToken, env_config_1.env.get().JWT_REFRESH_SECRET);
    const accessToken = (0, jwt_config_1.createToken)({
        email: payload.email,
        role: payload.role,
        userId: payload.userId,
        companyId: payload.companyId,
    }, env_config_1.env.get().JWT_SECRET, 60 * 60 * 8);
    return res.status(200).json({ accessToken });
};
exports.refrehToken = refrehToken;
const logoutUser = async (req, res, next) => {
    const email = req.user?.email;
    if (!email) {
        return next(new app_error_1.AppError("Vous n'êtes pas authentifié.", 403));
    }
    await db_config_1.prisma.session.deleteMany({
        where: {
            target: email,
        },
    });
    return res.status(200).json({ message: 'Vous aviez été déconnecté.' });
};
exports.logoutUser = logoutUser;
//# sourceMappingURL=auth.controller.js.map