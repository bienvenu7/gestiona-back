import type { Request, Response } from 'express';
import { CreateClientSchema, QuerySchema } from '../schema/company.schema';

import { prisma } from '../config/db.config';

export const createNewClient = async (req: Request, res: Response) => {
  const { id: companyId } = QuerySchema.parse(req.query);
  const { name, number } = CreateClientSchema.parse(req.body);

  const createClient = await prisma.client.create({
    data: {
      companyId,
      name,
      number,
    },
  });

  return res.status(201).json(createClient);
};

export const getClients = async (req: Request, res: Response) => {
  const { id: companyId } = QuerySchema.parse(req.query);

  const clients = await prisma.client.findMany({
    where: {
      companyId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return res.status(200).json(clients);
};
