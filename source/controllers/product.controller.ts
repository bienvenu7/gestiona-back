import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/app.error';
import * as XLSX from 'xlsx';
import { io } from '../server';
import { prisma } from '../config/db.config';
import { CreateProductSchema, QuerySchema } from '../schema/company.schema';
import { generateSKU, validatorRow } from '../config/multer.config';

export const createManyProductfromXml = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const file = req.file;

  const { id: companyId } = QuerySchema.parse(req.query);

  if (!file) {
    return next(new AppError("Aucun ficher n'a été soumis", 400));
  }

  const workbook = XLSX.read(file.buffer, { type: 'buffer' });
  const sheetName = workbook.SheetNames[0];
  const data = XLSX.utils.sheet_to_json<ProductExcelRow>(
    workbook.Sheets[sheetName],
    { defval: 0 }
  );

  const batchSize = 50,
    validRows: ProductExcelRow[] = [],
    failedRows: { row: number; error: string | null; data: ProductExcelRow }[] =
      [];

  let processed = 0;

  let responseProducts: {
    companyId: string;
    name: string;
    price: number;
    stockQuantity: number;
    sku: string;
  }[] = [];

  data.forEach((row, index) => {
    const error = validatorRow(row);

    if (error) {
      failedRows.push({
        row: index + 2, // +2 car Excel commence à 1 + header
        error,
        data: row,
      });
    } else {
      validRows.push({
        nom: row.nom.trim(),
        prix: Number(row.prix),
        stock: row.stock,
      });
    }
  });

  const total = validRows.length;

  for (let i = 0; i < validRows.length; i += batchSize) {
    const batch = validRows.slice(i, i + batchSize).map(row => ({
      companyId,
      name: row['nom'],
      price: row['prix'],
      stockQuantity: row['stock'],
      sku: generateSKU(row['nom']),
    }));

    await prisma.product.createMany({
      data: batch,
      skipDuplicates: true,
    });

    processed += batch.length;

    io.emit('uploadProgress', {
      processed,
      total,
      failed: failedRows.length,
      percentage: Math.round((processed / total) * 100),
    });

    responseProducts = [...responseProducts, ...batch];
  }

  io.to(`${companyId}`).emit('productsCreated', responseProducts);

  return res.status(201).json({
    message: 'Importation des produits reussies',
    totalRows: data.length,
    inserted: validRows.length,
    failed: failedRows.length,
    errors: failedRows,
    products: responseProducts,
  });
};

export const createOneProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const product = CreateProductSchema.parse(req.body);

  const createP = await prisma.product.create({
    data: { ...product, sku: generateSKU(product.name) },
  });

  if (!createP) {
    return next(new AppError('Impossible de créer un produit', 405));
  }

  io.to(`${product.companyId}`).emit('newProduct', createP);

  return res.status(201).json(createP);
};

export const getProducts = async (req: Request, res: Response) => {
  const { id } = QuerySchema.parse(req.query);

  const products = await prisma.product.findMany({
    where: {
      companyId: id,
    },
    select: {
      companyId: true,
      price: true,
      name: true,
      sku: true,
      stockQuantity: true,
      id: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return res.status(200).json({ data: products });
};
