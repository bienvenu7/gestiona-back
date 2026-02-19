import express from 'express';
import { NotFoundError, errorHandler } from '../middlewares/error.middleware';
export const configureErrorHandling = (app: express.Application) => {
  // 404 handler - must be after all routes
  app.use('*', (req, res, next) => {
    next(NotFoundError(req, res));
  });

  // Global error handler
  app.use(errorHandler);
};
