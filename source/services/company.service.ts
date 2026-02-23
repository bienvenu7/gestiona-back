import express from 'express';
import {
  registerCP,
  verifyHash,
  createUser,
  deleteUser,
  updateUserStatus,
  getUsers,
} from '../controllers/company.controller';
import { validateRequest } from '../middlewares/error.middleware';
import {
  CreateCompanySchema,
  CreateUserFromOwner,
  HashSchema,
  QuerySchema,
  UpdateUserSchema,
} from '../schema/company.schema';
import { isAuhenticated } from '../middlewares/authentication';

const router = express.Router();

router.post(
  '/register',
  validateRequest({ body: CreateCompanySchema }),
  registerCP
);

router.post(
  '/create-user',
  isAuhenticated,
  validateRequest({ body: CreateUserFromOwner }),
  createUser
);

router.get(
  '/users',
  isAuhenticated,
  validateRequest({ query: QuerySchema }),
  getUsers
);

router.delete(
  '/delete-user',
  isAuhenticated,
  validateRequest({ query: QuerySchema }),
  deleteUser
);

router.patch(
  '/update-user',
  isAuhenticated,
  validateRequest({ query: QuerySchema, body: UpdateUserSchema }),
  updateUserStatus
);

router.patch('/verify-otp', validateRequest({ body: HashSchema }), verifyHash);

export default router;
