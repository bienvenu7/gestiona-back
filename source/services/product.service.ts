import express from 'express';
import { validateRequest } from '../middlewares/error.middleware';
import { isAuhenticated } from '../middlewares/authentication';
import { CreateProductSchema, QuerySchema } from '../schema/company.schema';
import {
  createManyProductfromXml,
  createOneProduct,
  getProducts,
} from '../controllers/product.controller';
import { upload } from '../config/multer.config';

const router = express.Router();

router.post(
  '/create-products',
  isAuhenticated,
  upload.single('file'),
  validateRequest({ query: QuerySchema }),
  createManyProductfromXml
);

router.post(
  '/create-one',
  isAuhenticated,
  validateRequest({ body: CreateProductSchema }),
  createOneProduct
);

router.get(
  '/get-products',
  isAuhenticated,
  validateRequest({ query: QuerySchema }),
  getProducts
);

export default router;
