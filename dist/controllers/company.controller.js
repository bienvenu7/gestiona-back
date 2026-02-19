"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyHash = exports.registerCP = void 0;
const company_schema_1 = require("../schema/company.schema");
const db_config_1 = require("../config/db.config");
const app_error_1 = require("../utils/app.error");
const otp_1 = require("../utils/otp");
const mailer_config_1 = require("../config/mailer.config");
const env_config_1 = __importDefault(require("../config/env.config"));
const jwt_config_1 = require("../config/jwt.config");
const logger_1 = require("../utils/logger");
const registerCP = async (req, res, next) => {
    const { email, name, password } = company_schema_1.CreateCompanySchema.parse(req.body);
    const findExistingCp = await db_config_1.prisma.company.findFirst({
        where: {
            OR: [{ email }, { name }],
        },
    });
    if (findExistingCp) {
        return next(new app_error_1.AppError('Une entreprise ayant ce nom existe déjà', 403));
    }
    const createCp = await db_config_1.prisma.company.create({
        data: {
            email,
            name,
            password,
        },
    });
    if (!createCp) {
        return next(new app_error_1.AppError("Une erreur s'est produit lors de la création l'entreprise", 405));
    }
    const otp = (0, otp_1.generateOtp)();
    const hash = (0, otp_1.hashOtp)(otp);
    const { id: hash_id } = await db_config_1.prisma.otp.create({
        data: {
            hash,
            target: email,
            expiredAt: (0, jwt_config_1.expiredAtFunc)(1 * 60 * 1000),
        },
        select: {
            id: true,
        },
    });
    logger_1.logger.info(hash);
    const sendHashToUser = await (0, mailer_config_1.sendHash)(hash, email);
    if (sendHashToUser === 'failed') {
        await db_config_1.prisma.company.delete({
            where: {
                id: createCp.id,
            },
        });
        await db_config_1.prisma.otp.delete({
            where: {
                id: hash_id,
            },
        });
        return next(new app_error_1.AppError("Impossible d'envoyer le code de vérification via votre adresse email.", 405));
    }
    res.status(201).json(createCp);
};
exports.registerCP = registerCP;
const verifyHash = async (req, res, next) => {
    const { code, email } = company_schema_1.HashSchema.parse(req.body);
    const hash = (0, otp_1.hashOtp)(code);
    const otpRecord = await db_config_1.prisma.otp.findFirst({
        where: {
            target: email,
            hash,
            used: false,
            expiredAt: { gt: new Date() },
        },
        select: {
            id: true,
            isCompany: true,
        },
    });
    if (!otpRecord) {
        return next(new app_error_1.AppError('le code est invalide ou est déjé expiré', 400));
    }
    // mark as used
    await db_config_1.prisma.otp.update({
        where: { id: otpRecord.id },
        data: { used: true },
    });
    if (otpRecord.isCompany) {
        const getCompany = await db_config_1.prisma.company.findUnique({
            where: {
                email,
            },
        });
        const accessToken = (0, jwt_config_1.createToken)({
            companyId: getCompany.id,
            email,
            role: 'OWNER',
            userId: getCompany.id,
        }, env_config_1.default.JWT_SECRET, 60 * 60 * 8);
        const refreshToken = (0, jwt_config_1.createToken)({
            companyId: getCompany.id,
            email,
            role: 'OWNER',
            userId: getCompany.id,
        }, env_config_1.default.JWT_SECRET, 60 * 60 * 24 * 30);
        await db_config_1.prisma.session.create({
            data: {
                expiredAt: (0, jwt_config_1.expiredAtFunc)(60 * 60 * 24 * 30),
                hash: refreshToken,
                target: email,
            },
        });
        res
            .cookie('refresh', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // HTTPS en prod
            sameSite: 'lax', // ou 'lax' si frontend séparé
            maxAge: 1000 * 60 * 60 * 24 * 30, // 7 jours
            path: '/', // accessible partout
        })
            .status(201)
            .json({ accessToken });
    }
    res.status(201).json();
};
exports.verifyHash = verifyHash;
//# sourceMappingURL=company.controller.js.map