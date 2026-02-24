import type { Request, Response, NextFunction } from 'express';
import { loginUserSchema } from '../schema/company.schema';
import { prisma } from '../config/db.config';
import { generateOtp, hashOtp } from '../utils/otp';
import { AppError } from '../utils/app.error';
import { sendHash } from '../config/mailer.config';
import { createToken, expiredAtFunc } from '../config/jwt.config';
import { logger } from '../utils/logger';
import { verify } from 'jsonwebtoken';
import { getEnv } from '../config/env.config';

const envConfig = getEnv();
import { IJwtPayload } from '../types/auth';

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = loginUserSchema.parse(req.body);

  const hashPassword = hashOtp(password);

  const foundUser = await prisma.user.findUnique({
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
    return next(
      new AppError(
        "Le mot de passse ou l'addresse email ne corresponds pas.",
        403
      )
    );
  }

  const otp = generateOtp();
  const hash = hashOtp(otp);

  logger.info(otp);

  const createOtp = await prisma.otp.create({
    data: {
      hash,
      target: email,
      expiredAt: expiredAtFunc(1 * 60 * 1000),
    },
    select: {
      id: true,
    },
  });

  const sendOtp = await sendHash(otp, email);

  if (sendOtp === 'failed') {
    await prisma.otp.delete({
      where: {
        id: createOtp.id,
      },
    });

    return next(
      new AppError(
        "Impossible d'envoyer l'addresse de confirmation via votre addresse email",
        403
      )
    );
  }

  return res.status(200).json({
    message:
      "Vous aviez reçu un email de confirmation veillez s'il vous plait le saisir.",
  });
};

export const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user_id = req.user?.userId;

  if (!user_id) {
    return next(new AppError("Vous n'êtes pas autorisé!", 403));
  }

  const user = await prisma.user.findUnique({
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
    return next(
      new AppError("Aucun utilisateur n'a été trouvé avec ces coordonnées", 403)
    );
  }

  return res.status(200).json(user);
};

export const refrehToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const refreshToken = req.cookies.refresh;

  if (!refreshToken) {
    return next(new AppError("Vous n'êtes authentifié", 401));
  }

  const payload = verify(
    refreshToken,
    envConfig.JWT_REFRESH_SECRET
  ) as IJwtPayload;

  const accessToken = createToken(
    {
      email: payload.email,
      role: payload.role,
      userId: payload.userId,
      companyId: payload.companyId,
    },
    envConfig.JWT_SECRET,
    60 * 60 * 8
  );

  return res.status(200).json({ accessToken });
};

export const logoutUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const email = req.user?.email;

  if (!email) {
    return next(new AppError("Vous n'êtes pas authentifié.", 403));
  }

  await prisma.session.deleteMany({
    where: {
      target: email,
    },
  });

  return res.status(200).json({ message: 'Vous aviez été déconnecté.' });
};
