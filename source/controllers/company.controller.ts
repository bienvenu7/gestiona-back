import type { Request, Response, NextFunction } from 'express';
import {
  CreateCompanySchema,
  CreateUserFromOwner,
  HashSchema,
  QuerySchema,
  UpdateUserSchema,
} from '../schema/company.schema';
import { prisma } from '../config/db.config';
import { AppError } from '../utils/app.error';
import { generateOtp, hashOtp } from '../utils/otp';
import { sendHash } from '../config/mailer.config';
import { createToken, expiredAtFunc } from '../config/jwt.config';
import { logger } from '../utils/logger';
import { genPassword } from '../utils/gen.psd';

import { getEnv } from '../config/env.config';

const envConfig =
  process.env.NODE_ENV !== 'production' ? getEnv() : process.env;

export const registerCP = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, user } = CreateCompanySchema.parse(req.body);

  const findExistingCp = await prisma.company.findFirst({
    where: {
      name,
    },
  });

  if (findExistingCp) {
    return next(new AppError('Une entreprise ayant ce nom existe déjà', 403));
  }

  const hashPassword = hashOtp(user.password);

  const createCp = await prisma.company.create({
    data: {
      name,
      users: {
        create: { ...user, password: hashPassword, role: 'OWNER' },
      },
    },
  });

  if (!createCp) {
    return next(
      new AppError(
        "Une erreur s'est produit lors de la création l'entreprise",
        405
      )
    );
  }

  const otp = generateOtp();
  const hash = hashOtp(otp);

  const { id: hash_id } = await prisma.otp.create({
    data: {
      hash,
      target: user.email,
      expiredAt: expiredAtFunc(1 * 60 * 1000),
    },
    select: {
      id: true,
    },
  });

  logger.info(otp);

  const sendHashToUser = await sendHash(otp, user.email);

  if (sendHashToUser === 'failed') {
    await prisma.user.deleteMany({
      where: {
        companyId: createCp.id,
      },
    });

    await prisma.company.delete({
      where: {
        id: createCp.id,
      },
    });

    await prisma.otp.delete({
      where: {
        id: hash_id,
      },
    });

    return next(
      new AppError(
        "Impossible d'envoyer le code de vérification via votre adresse email.",
        405
      )
    );
  }

  res.status(201).json({
    message:
      "Vous aviez reçu un email de confirmation veillez s'il vous plait suivre les instructions.",
  });
};

export const verifyHash = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { code, email } = HashSchema.parse(req.body);

  const hash = hashOtp(code);

  const otpRecord = await prisma.otp.findFirst({
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
    return next(new AppError('le code est invalide ou est déjé expiré', 400));
  }

  // mark as used

  const user = await prisma.user.findUnique({
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
    return next(new AppError("Une erreur inconnue s'est produite", 405));
  }

  const accessToken = createToken(
    {
      email,
      role: user!.role,
      userId: user!.id,
      companyId: user!.companyId,
    },
    envConfig.JWT_SECRET!,
    60 * 60 * 8
  );
  const refreshToken = createToken(
    {
      email,
      role: user!.role,
      userId: user!.id,
      companyId: user!.companyId,
    },
    envConfig.JWT_REFRESH_SECRET!,
    60 * 60 * 24 * 30
  );

  await prisma.session.create({
    data: {
      expiredAt: expiredAtFunc(60 * 60 * 24 * 30),
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

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userData = CreateUserFromOwner.parse(req.body);

  const password = genPassword();

  const hashPassword = hashOtp(password);

  const user = await prisma.user.create({
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
    return next(new AppError("Une erreur inconnue s'est produite.", 405));
  }

  const sendHashToUser = await sendHash(password, userData.email);

  if (sendHashToUser === 'failed') {
    await prisma.user.delete({
      where: {
        id: user.id,
      },
    });

    return next(
      new AppError(
        "Impossible d'envoyer le code de vérification via cette adresse email.",
        405
      )
    );
  }

  return res.status(201).json(user);
};

export const getUsers = async (req: Request, res: Response) => {
  const { id: companyId } = QuerySchema.parse(req.query);

  const users = await prisma.user.findMany({
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

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = QuerySchema.parse(req.query);

  const { id: user_id, name } = await prisma.user.delete({
    where: {
      id,
    },
    select: {
      id: true,
      name: true,
    },
  });

  if (!user_id) {
    return next(new AppError("Une erreur inconnue s'est produite.", 405));
  }

  return res.status(201).json({
    message: `Vous venez de suprrimer l'utilisateur au nom de: ${name}`,
  });
};

export const updateUserStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = QuerySchema.parse(req.query);
  const updateData = UpdateUserSchema.parse(req.body);

  const { id: user_id, name: username } = await prisma.user.update({
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
    return next(new AppError("Une erreur inconnue s'est produite.", 405));
  }

  return res.status(201).json({
    message: `la modification de l'utilisateur ${username} a été effectué avec succèss.`,
  });
};
