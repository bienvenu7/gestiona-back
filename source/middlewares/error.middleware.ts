import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { AppError } from '../utils/app.error';

export const errorHandler = (err: Error, req: Request, res: Response) => {
  let statusCode = 500;
  let message = "Une erreur inconnue s'est produite. Merci d'être patient!";
  let errors: unknown = undefined;

  if (err instanceof AppError) {
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

export const validateRequest =
  (schemas: { body?: ZodSchema; query?: ZodSchema; params?: ZodSchema }) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schemas.body?.parse(req.body);
      schemas.query?.parse(req.query);
      schemas.params?.parse(req.params);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.issues.map(err => ({
          field: err.path.join('.'),
          message: err.message,
        }));

        return next(new AppError('Erreur de validation!', 400, errors));
      }

      next(new AppError("Une erreur s'est produite!", 500));
    }
  };

export const NotFoundError = (req: Request, res: Response) => {
  return res.status(404).json({
    success: false,
    statusCode: 404,
    message: 'Url inexistant',
    path: req.originalUrl,
    timestamp: new Date().toISOString(),
  });
};
