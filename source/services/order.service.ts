import express from 'express';
import { isAuhenticated } from '../middlewares/authentication';
import { validateRequest } from '../middlewares/error.middleware';
import {
  CreateOrderWithCart,
  CreatePaymentSchema,
  QuerySchema,
} from '../schema/company.schema';
import {
  createOrder,
  getCompanyOrders,
  getPayment,
  getPaymentStats,
  payOrder,
} from '../controllers/order.controller';

const router = express.Router();

router.post(
  '/create-order',
  isAuhenticated,
  validateRequest({ body: CreateOrderWithCart }),
  createOrder
);

router.post(
  '/pay-order',
  isAuhenticated,
  validateRequest({ body: CreatePaymentSchema }),
  payOrder
);

router.get(
  '/orders',
  isAuhenticated,
  validateRequest({ query: QuerySchema }),
  getCompanyOrders
);

router.get(
  '/payments',
  isAuhenticated,
  validateRequest({ query: QuerySchema }),
  getPayment
);

router.get(
  '/payments-stats',
  isAuhenticated,
  validateRequest({ query: QuerySchema }),
  getPaymentStats
);

export default router;
