import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/app.error';
import { IJwtPayload } from '../types/auth';
import { verifyToken } from '../config/jwt.config';

import { getEnv } from '../config/env.config';

const envConfig = getEnv();

/**
 * Extension de Request pour inclure l'utilisateur
 */
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: IJwtPayload;
    }
  }
}

export const isAuhenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return next(new AppError("Vous n'êtes pas autorisé!", 401));
  }

  const token = authHeader.replace('Bearer ', '');

  try {
    const payload = verifyToken(token, envConfig.JWT_SECRET);
    req.user = payload as IJwtPayload;
    next();
  } catch {
    return next(
      new AppError("Votre clé d'authentification n'est pas valide", 401)
    );
  }
};

export const isPermitted = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { role } = req.user!;

  const requireRoles = ['OWNER', 'STAFF'];

  if (!requireRoles.includes(role)) {
    return next(
      new AppError("Vous n'êtes pas autorisé à éfectué cette tache!", 401)
    );
  }

  next();
};
