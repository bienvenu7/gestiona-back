"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserStatus = exports.deleteUser = exports.getUsers = exports.createUser = exports.verifyHash = exports.registerCP = void 0;
const company_schema_1 = require("../schema/company.schema");
const db_config_1 = require("../config/db.config");
const app_error_1 = require("../utils/app.error");
const otp_1 = require("../utils/otp");
const mailer_config_1 = require("../config/mailer.config");
const jwt_config_1 = require("../config/jwt.config");
const logger_1 = require("../utils/logger");
const gen_psd_1 = require("../utils/gen.psd");
const env_config_1 = require("../config/env.config");
const envConfig = process.env.NODE_ENV !== 'production' ? (0, env_config_1.getEnv)() : process.env;
const registerCP = async (req, res, next) => {
    const { name, user } = company_schema_1.CreateCompanySchema.parse(req.body);
    const findExistingCp = await db_config_1.prisma.company.findFirst({
        where: {
            name,
        },
    });
    if (findExistingCp) {
        return next(new app_error_1.AppError('Une entreprise ayant ce nom existe déjà', 403));
    }
    const hashPassword = (0, otp_1.hashOtp)(user.password);
    const createCp = await db_config_1.prisma.company.create({
        data: {
            name,
            users: {
                create: { ...user, password: hashPassword, role: 'OWNER' },
            },
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
            target: user.email,
            expiredAt: (0, jwt_config_1.expiredAtFunc)(1 * 60 * 1000),
        },
        select: {
            id: true,
        },
    });
    logger_1.logger.info(otp);
    const sendHashToUser = await (0, mailer_config_1.sendHash)(otp, user.email);
    if (sendHashToUser === 'failed') {
        await db_config_1.prisma.user.deleteMany({
            where: {
                companyId: createCp.id,
            },
        });
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
    res.status(201).json({
        message: "Vous aviez reçu un email de confirmation veillez s'il vous plait suivre les instructions.",
    });
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
            // expiredAt: { gt: new Date() },
        },
        select: {
            id: true,
            target: true,
        },
    });
    console.log(otpRecord);
    if (!otpRecord) {
        return next(new app_error_1.AppError('le code est invalide ou est déjé expiré', 400));
    }
    // mark as used
    const user = await db_config_1.prisma.user.findUnique({
        where: {
            email: otpRecord.target,
        },
        select: {
            id: true,
            role: true,
            companyId: true,
        },
    });
    if (!user) {
        return next(new app_error_1.AppError("Une erreur inconnue s'est produite", 405));
    }
    const accessToken = (0, jwt_config_1.createToken)({
        email,
        role: user.role,
        userId: user.id,
        companyId: user.companyId,
    }, envConfig.JWT_SECRET, 60 * 60 * 8);
    const refreshToken = (0, jwt_config_1.createToken)({
        email,
        role: user.role,
        userId: user.id,
        companyId: user.companyId,
    }, envConfig.JWT_REFRESH_SECRET, 60 * 60 * 24 * 30);
    await db_config_1.prisma.session.create({
        data: {
            expiredAt: (0, jwt_config_1.expiredAtFunc)(60 * 60 * 24 * 30),
            hash: refreshToken,
            target: email,
        },
    });
    res
        .cookie('app_token', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // HTTPS en prod
        sameSite: 'lax', // ou 'lax' si frontend séparé
        maxAge: 1000 * 60 * 60 * 24 * 30, // 7 jours
        path: '/', // accessible partout
    })
        .status(201)
        .json({ accessToken });
};
exports.verifyHash = verifyHash;
const createUser = async (req, res, next) => {
    const userData = company_schema_1.CreateUserFromOwner.parse(req.body);
    const password = (0, gen_psd_1.genPassword)();
    const hashPassword = (0, otp_1.hashOtp)(password);
    const user = await db_config_1.prisma.user.create({
        data: { ...userData, password: hashPassword },
        select: {
            id: true,
            email: true,
            companyId: true,
            name: true,
            role: true,
            createdAt: true,
        },
    });
    if (!user) {
        return next(new app_error_1.AppError("Une erreur inconnue s'est produite.", 405));
    }
    const sendHashToUser = await (0, mailer_config_1.sendHash)(password, userData.email);
    if (sendHashToUser === 'failed') {
        await db_config_1.prisma.user.delete({
            where: {
                id: user.id,
            },
        });
        return next(new app_error_1.AppError("Impossible d'envoyer le code de vérification via cette adresse email.", 405));
    }
    return res.status(201).json(user);
};
exports.createUser = createUser;
const getUsers = async (req, res) => {
    const { id: companyId } = company_schema_1.QuerySchema.parse(req.query);
    const users = await db_config_1.prisma.user.findMany({
        where: { companyId },
        select: {
            id: true,
            email: true,
            companyId: true,
            name: true,
            role: true,
            createdAt: true,
        },
        orderBy: {
            createdAt: 'desc',
        },
    });
    return res.status(200).json(users);
};
exports.getUsers = getUsers;
const deleteUser = async (req, res, next) => {
    const { id } = company_schema_1.QuerySchema.parse(req.query);
    const { id: user_id, name } = await db_config_1.prisma.user.delete({
        where: {
            id,
        },
        select: {
            id: true,
            name: true,
        },
    });
    if (!user_id) {
        return next(new app_error_1.AppError("Une erreur inconnue s'est produite.", 405));
    }
    return res.status(201).json({
        message: `Vous venez de suprrimer l'utilisateur au nom de: ${name}`,
    });
};
exports.deleteUser = deleteUser;
const updateUserStatus = async (req, res, next) => {
    const { id } = company_schema_1.QuerySchema.parse(req.query);
    const updateData = company_schema_1.UpdateUserSchema.parse(req.body);
    const { id: user_id, name: username } = await db_config_1.prisma.user.update({
        where: {
            id,
        },
        data: updateData,
        select: {
            id: true,
            name: true,
        },
    });
    if (!user_id) {
        return next(new app_error_1.AppError("Une erreur inconnue s'est produite.", 405));
    }
    return res.status(201).json({
        message: `la modification de l'utilisateur ${username} a été effectué avec succèss.`,
    });
};
exports.updateUserStatus = updateUserStatus;
//# sourceMappingURL=company.controller.js.map