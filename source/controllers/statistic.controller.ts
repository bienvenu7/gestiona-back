import type { Request, Response, NextFunction } from 'express';
import { QuerySchema } from '../schema/company.schema';
import { prisma } from '../config/db.config';
import { AppError } from '../utils/app.error';

export const getOverviewStatistic = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id, dateMonth } = QuerySchema.parse(req.query);

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

  const revenue = await prisma.order.aggregate({
    where: {
      companyId: id,
      status: 'FINISH',
      createdAt: {
        gte: startOfMonth,
        lte: endOfMonth,
      },
    },
    _sum: {
      totalAmount: true,
    },
    _count: true,
  });

  const expenses = await prisma.cost.aggregate({
    where: {
      companyId: id,
      createdAt: {
        gte: startOfMonth,
        lte: endOfMonth,
      },
    },
    _sum: {
      amount: true,
    },
  });

  const product = await prisma.product.count({
    where: {
      companyId: id,
    },
  });

  const revenues = revenue._sum.totalAmount || 0;
  const expense = expenses._sum.amount || 0;

  const result = {
    revenue: revenues,
    total_orders: revenue._count,
    profit: revenues - expense,
    total_products: product || 0,
  };

  return res.status(200).json(result);
};

export const getChartsByDays = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id, startDate, endDate, dateMonth } = QuerySchema.parse(req.query);

  if (startDate && endDate) {
    const start = startDate
      ? new Date(startDate)
      : new Date(new Date().setDate(new Date().getDate() - 6));

    const end = endDate ? new Date(endDate) : new Date();

    // 📊 DAILY SALES
    const dailySales = await prisma.$queryRaw<{ date: Date; total: number }[]>`
      SELECT 
        DATE("createdAt") as date,
        SUM(total)::float as total
      FROM "Order"
      WHERE "id" = ${id} AND "createdAt" BETWEEN ${start} AND ${end}
      GROUP BY DATE("createdAt")
      ORDER BY date ASC
    `;

    return res.status(200).json(dailySales);
  }

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

  // 📊 DAILY SALES
  const dailySales = await prisma.$queryRaw<{ date: Date; total: number }[]>`
  SELECT 
    DATE("createdAt") as date,
    SUM(total)::float as total
  FROM "Order"
  WHERE "id" = ${id} AND "createdAt" BETWEEN ${startOfMonth} AND ${endOfMonth}
  GROUP BY DATE("createdAt")
  ORDER BY date ASC
`;

  return res.status(200).json(dailySales);
};

// export const getChartsByYear = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const { id, startDate, endDate, dateMonth } = QuerySchema.parse(req.query);

//   if (!dateMonth) {

//   }

//   const monthlySales = await prisma.$queryRaw`
//   SELECT
//     DATE_TRUNC('month', "createdAt") as month,
//     SUM(total)::float as total
//   FROM "Order"
//   WHERE "id" = ${id} AND "createdAt" >= NOW() - INTERVAL '11 months'
//   GROUP BY month
//   ORDER BY month ASC
// `;
// };
