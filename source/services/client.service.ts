import express from 'express';
import { validateRequest } from '../middlewares/error.middleware';
import { isAuhenticated } from '../middlewares/authentication';
import { CreateClientSchema, QuerySchema } from '../schema/company.schema';
import { createNewClient, getClients } from '../controllers/client.controller';

const router = express.Router();

router.post(
  '/create-client',
  isAuhenticated,
  validateRequest({ body: CreateClientSchema, query: QuerySchema }),
  createNewClient
);

router.get(
  '/clients',
  isAuhenticated,
  validateRequest({ query: QuerySchema }),
  getClients
);

export default router;
