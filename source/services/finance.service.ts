import express from 'express';
import { validateRequest } from '../middlewares/error.middleware';
import {
  CreateCostSchema,
  CreateSalarySchema,
  QuerySchema,
} from '../schema/company.schema';
import { isAuhenticated, isPermitted } from '../middlewares/authentication';
import {
  createCost,
  getCost,
  getCostStats,
  getSalaries,
  getSalariesStats,
  paySalary,
} from '../controllers/finance.controller';

const router = express.Router();

router.post(
  '/pay-salary',
  validateRequest({ body: CreateSalarySchema }),
  isAuhenticated,
  isPermitted,
  paySalary
);

router.post(
  '/create-expensive',
  validateRequest({ body: CreateCostSchema }),
  isAuhenticated,
  createCost
);

router.get(
  '/salaries',
  validateRequest({ query: QuerySchema }),
  isAuhenticated,
  isPermitted,
  getSalaries
);

router.get(
  '/salaries-stats',
  validateRequest({ query: QuerySchema }),
  isAuhenticated,
  isPermitted,
  getSalariesStats
);

router.get(
  '/expenses',
  validateRequest({ query: QuerySchema }),
  isAuhenticated,
  getCost
);

router.get(
  '/expenses-stats',
  validateRequest({ query: QuerySchema }),
  isAuhenticated,
  getCostStats
);

export default router;
