import express from 'express';
import {
  registerCP,
  verifyHash,
  createUser,
  deleteUser,
  updateUserStatus,
} from '../controllers/company.controller';
import { validateRequest } from '../middlewares/error.middleware';
import {
  CreateCompanySchema,
  CreateUserFromOwner,
  HashSchema,
  QuerySchema,
  UpdateUserSchema,
} from '../schema/company.schema';

const router = express.Router();

router.post(
  '/register',
  validateRequest({ body: CreateCompanySchema }),
  registerCP
);

router.post(
  '/create-user',
  validateRequest({ body: CreateUserFromOwner }),
  createUser
);

router.delete(
  '/delete-user',
  validateRequest({ query: QuerySchema }),
  deleteUser
);

router.patch(
  '/update-user',
  validateRequest({ query: QuerySchema, body: UpdateUserSchema }),
  updateUserStatus
);

router.patch('/verify-otp', validateRequest({ body: HashSchema }), verifyHash);

export default router;
