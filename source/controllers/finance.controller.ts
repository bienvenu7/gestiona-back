import type { Request, Response, NextFunction } from 'express';
import {
  CreateCostSchema,
  CreateSalarySchema,
  QuerySchema,
} from '../schema/company.schema';
import { prisma } from '../config/db.config';
import { io } from '../server';
import { AppError } from '../utils/app.error';

export const paySalary = async (req: Request, res: Response) => {
  const salaryData = CreateSalarySchema.parse(req.body);

  const salary = await prisma.salary.create({
    data: salaryData,
    include: {
      user: {
        select: {
          email: true,
          name: true,
        },
      },
    },
  });

  return res.status(201).json(salary);
};

export const getSalaries = async (req: Request, res: Response) => {
  const { id: companyId, dateMonth, userId } = QuerySchema.parse(req.query);

  if (userId && dateMonth) {
    const date = new Date(dateMonth);
    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 1);

    const salaries = await prisma.salary.findMany({
      where: {
        companyId,
        createdAt: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
        user: {
          id: userId,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return res.status(200).json(salaries);
  }

  if (userId) {
    const salaries = await prisma.salary.findMany({
      where: {
        companyId,
        user: {
          id: userId,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return res.status(200).json(salaries);
  }

  if (dateMonth) {
    const date = new Date(dateMonth);
    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 1);
    const salaries = await prisma.salary.findMany({
      where: {
        companyId,
        createdAt: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return res.status(200).json(salaries);
  }

  const salaries = await prisma.salary.findMany({
    where: {
      companyId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
  return res.status(200).json(salaries);
};

export const getSalariesStats = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id: companyId, dateMonth } = QuerySchema.parse(req.query);

  if (!dateMonth) {
    return next(
      new AppError('pas de date fournie', 400, [
        { field: 'date', message: 'la date est obligtoire!' },
      ])
    );
  }

  const date = new Date(dateMonth!);
  const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 1);

  const salaries = await prisma.salary.aggregate({
    where: {
      companyId,
      createdAt: {
        gte: startOfMonth,
        lte: endOfMonth,
      },
    },
    _count: true,
    _sum: { amount: true },
  });

  const users = await prisma.user.aggregate({
    where: {
      companyId,
      salaries: {
        some: {
          createdAt: {
            gte: startOfMonth,
            lte: endOfMonth,
          },
        },
      },
    },
    _count: true,
  });

  const returnData = {
    totalPaid: salaries._count,
    amountTotal: salaries._sum,
    totalNonPaid: salaries._count - users._count,
    totalUsers: users._count + salaries._count,
  };

  return res.status(200).json(returnData);
};

export const createCost = async (req: Request, res: Response) => {
  const costData = CreateCostSchema.parse(req.body);

  const cost = await prisma.cost.create({
    data: costData,
  });

  io.to(costData.companyId).emit('cost-created', cost);

  return res.status(201).json(cost);
};

export const getCost = async (req: Request, res: Response) => {
  const { id: companyId, dateMonth } = QuerySchema.parse(req.query);

  if (dateMonth) {
    const date = new Date(dateMonth);
    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 1);

    const costs = await prisma.cost.findMany({
      where: {
        companyId,
        createdAt: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return res.status(200).json(costs);
  }

  const costs = await prisma.cost.findMany({
    where: {
      companyId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
  return res.status(200).json(costs);
};

export const getCostStats = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id: companyId, dateMonth } = QuerySchema.parse(req.query);

  if (!dateMonth) {
    return next(
      new AppError('pas de date fournie', 400, [
        { field: 'date', message: 'la date est obligtoire!' },
      ])
    );
  }

  const date = new Date(dateMonth!);
  const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 1);

  const cost = await prisma.cost.aggregate({
    where: {
      companyId,
      createdAt: {
        gte: startOfMonth,
        lte: endOfMonth,
      },
    },
    _count: true,
    _sum: { amount: true },
  });

  const returnData = {
    totalCost: cost._count,
    amountTotal: cost._sum,
  };

  return res.status(200).json(returnData);
};
