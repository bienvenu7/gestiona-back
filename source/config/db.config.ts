import { Prisma } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AppError } from '../utils/app.error';

export const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

export function prismaErrorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case 'P2002':
        return next(new AppError('La référence unique a été dupliquée', 409));

      case 'P2025':
        return next(new AppError('Aucune données trouvées', 404));

      default:
        return next(
          new AppError(
            "Une erreur s'est produite lors de la connection à la database.",
            500
          )
        );
    }
  }

  if (err instanceof Prisma.PrismaClientValidationError) {
    return next(new AppError('Query invalide depuis la database.', 400));
  }

  if (err instanceof Prisma.PrismaClientInitializationError) {
    return next(
      new AppError(
        "Une erreur s'est produite lors de la connection à la database.",
        500
      )
    );
  }

  return next(err); // pass to the next error handler
}
