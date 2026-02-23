import express from 'express';
import companyService from '../services/company.service';
import authService from '../services/auth.service';
import productService from '../services/product.service';
import clientService from '../services/client.service';
import orderService from '../services/order.service';

// Configure all routes
export const configureRoutes = (app: express.Application) => {
  // API routes and services
  app.use('/v1/company', companyService);
  app.use('/v1/auth', authService);
  app.use('/v1/product', productService);
  app.use('/v1/client', clientService);
  app.use('/v1/order', orderService);
};
