import express from 'express';
import { validateRequest } from '../middlewares/error.middleware';
import { QuerySchema } from '../schema/company.schema';
import { isAuhenticated } from '../middlewares/authentication';
import { getOverviewStatistic } from '../controllers/statistic.controller';

const router = express.Router();

router.get(
  '/indicators',
  validateRequest({ query: QuerySchema }),
  isAuhenticated,
  getOverviewStatistic
);

export default router;
