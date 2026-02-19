import express from 'express';
import companyService from '../services/company.service';
import authService from '../services/auth.service';
import productService from '../services/product.service';

// Configure all routes
export const configureRoutes = (app: express.Application) => {
  // API routes and services
  app.use('/v1/company', companyService);
  app.use('/v1/auth', authService);
  app.use('/v1/product', productService);
};
