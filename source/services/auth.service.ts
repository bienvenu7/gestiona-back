import express from 'express';
import { validateRequest } from '../middlewares/error.middleware';
import { loginUserSchema } from '../schema/company.schema';
import {
  loginUser,
  getUser,
  refrehToken,
  logoutUser,
} from '../controllers/auth.controller';
import { isAuhenticated } from '../middlewares/authentication';

const router = express.Router();

router.post('/login', validateRequest({ body: loginUserSchema }), loginUser);

router.get('/get-access', refrehToken);

router.get('/me', isAuhenticated, getUser);

router.delete('/logout', isAuhenticated, logoutUser);

export default router;
