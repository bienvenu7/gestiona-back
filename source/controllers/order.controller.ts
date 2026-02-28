import type { Request, Response } from 'express';
import {
  CreateOrderWithCart,
  CreatePaymentSchema,
  QuerySchema,
} from '../schema/company.schema';
import { prisma } from '../config/db.config';
import { AppError } from '../utils/app.error';
import { io } from '../server';

//
export const createOrder = async (req: Request, res: Response) => {
  const { carts, order } = CreateOrderWithCart.parse(req.body);

  //verification du stock des produits
  const result = await prisma.$transaction(async tx => {
    // 1️⃣ Vérifier le stock dans la transaction
    const products = await tx.product.findMany({
      where: {
        id: { in: carts.map(c => c.productId) },
      },
      select: {
        id: true,
        stockQuantity: true,
        name: true,
      },
    });

    const productMap = new Map(products.map(p => [p.id, p]));

    const invalidItem = carts.find(cart => {
      const product = productMap.get(cart.productId);
      return !product || cart.quantity > product.stockQuantity;
    });

    if (invalidItem) {
      throw new AppError('Stock insuffisant', 400);
    }

    // 2️⃣ Créer la commande
    const orderNumber = new Date().getTime().toString();

    const newOrder = await tx.order.create({
      data: {
        ...order,
        orderNumber,
        products: {
          createMany: { data: carts },
        },
      },
      select: {
        products: {
          select: {
            productName: true,
            quantity: true,
          },
        },
        orderNumber: true,
        totalAmount: true,
        paidAmount: true,
        status: true,
        createdAt: true,
      },
    });

    // 3️⃣ Décrémenter le stock
    for (const item of carts) {
      await tx.product.update({
        where: {
          id: item.productId,
        },
        data: {
          stockQuantity: {
            decrement: item.quantity,
          },
        },
      });
    }

    return newOrder;
  });

  io.to(order.companyId).emit('order-created', result);

  return res.status(201).json(result);
};

export const getCompanyOrders = async (req: Request, res: Response) => {
  const { id, clientName, endDate, startDate } = QuerySchema.parse(req.query);

  if (clientName !== undefined && startDate && endDate) {
    const orders = await prisma.order.findMany({
      where: {
        companyId: id,
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
        company: {
          clients: {
            some: {
              name: clientName,
            },
          },
        },
      },
      select: {
        products: {
          select: {
            productName: true,
            quantity: true,
          },
        },
        orderNumber: true,
        totalAmount: true,
        paidAmount: true,
        status: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return res.status(200).json(orders);
  }

  if (clientName !== undefined) {
    const orders = await prisma.order.findMany({
      where: {
        companyId: id,
        company: {
          clients: {
            some: {
              name: clientName,
            },
          },
        },
      },
      select: {
        products: {
          select: {
            productName: true,
            quantity: true,
          },
        },
        orderNumber: true,
        totalAmount: true,
        paidAmount: true,
        status: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return res.status(200).json(orders);
  }

  if (startDate && endDate) {
    const orders = await prisma.order.findMany({
      where: {
        companyId: id,
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
        company: {
          clients: {
            some: {
              name: clientName,
            },
          },
        },
      },
      select: {
        products: {
          select: {
            productName: true,
            quantity: true,
          },
        },
        orderNumber: true,
        totalAmount: true,
        paidAmount: true,
        status: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return res.status(200).json(orders);
  }

  const orders = await prisma.order.findMany({
    where: {
      companyId: id,
    },
    select: {
      products: {
        select: {
          productName: true,
          quantity: true,
        },
      },
      orderNumber: true,
      totalAmount: true,
      paidAmount: true,
      status: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return res.status(200).json(orders);
};

export const payOrder = async (req: Request, res: Response) => {
  const paymentData = CreatePaymentSchema.parse(req.body);

  const result = await prisma.$transaction(
    async ctx => {
      const actuelOrder = await ctx.order.findUnique({
        where: {
          orderNumber: paymentData.orderNumber,
        },
      });

      if (!actuelOrder) {
        throw new AppError('Aucune commande correspondante', 400);
      }

      const clientData = await prisma.client.findUnique({
        where: {
          id: actuelOrder.clientId,
        },
      });

      if (clientData === null) {
        throw new AppError("Il y'a un probleme avec la commande...", 405);
      }

      const remainingAmount = actuelOrder.totalAmount - actuelOrder.paidAmount;

      if (paymentData.amountPaid > remainingAmount) {
        throw new AppError('Le montant dépasse le reste à payer', 400, [
          { field: 'amountPaid', message: 'Montant invalide' },
        ]);
      }

      const lastPayment = await ctx.payment.findFirst({
        orderBy: {
          paymentDate: 'desc',
        },
      });

      let paymentNumber = '';

      if (!lastPayment) {
        paymentNumber = 'PAY-1';
      } else {
        paymentNumber = `PAY-${parseInt(lastPayment.paymentNumber.split('-')[1]) + 1}`;
      }

      const payement = await ctx.payment.create({
        data: {
          ...paymentData,
          paymentNumber,
          clientPhone: clientData.number,
          clientName: clientData.name,
        },
      });

      const paidAmount = actuelOrder.paidAmount + paymentData.amountPaid;

      const order = await ctx.order.update({
        where: {
          orderNumber: paymentData.orderNumber,
        },
        data: {
          paidAmount,
          status: paidAmount === actuelOrder.totalAmount ? 'FINISH' : 'PARTIAL',
        },
        select: {
          products: {
            select: {
              productName: true,
              quantity: true,
            },
          },
          orderNumber: true,
          totalAmount: true,
          paidAmount: true,
          status: true,
          createdAt: true,
        },
      });

      return { payement, order };
    },
    { timeout: 10000 }
  );

  io.to(paymentData.companyId).emit('Created-payement', result.payement);

  return res.status(201).json(result.order);
};

export const getPayment = async (req: Request, res: Response) => {
  const { id: companyId, startDate, endDate } = QuerySchema.parse(req.query);

  if (startDate && endDate) {
    const payment = await prisma.payment.findMany({
      where: {
        companyId,
        paymentDate: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: {
        paymentDate: 'desc',
      },
    });
    return res.status(200).json(payment);
  }

  if (startDate) {
    const endDate = new Date(startDate);
    endDate.setUTCHours(23, 59, 59, 999);
    const payment = await prisma.payment.findMany({
      where: {
        companyId,
        paymentDate: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: {
        paymentDate: 'desc',
      },
    });
    return res.status(200).json(payment);
  }

  const now = new Date();

  // Start of current month
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  // Start of next month
  const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  const payment = await prisma.payment.findMany({
    where: {
      companyId,
      paymentDate: {
        gte: startOfMonth,
        lte: startOfNextMonth,
      },
    },
    orderBy: {
      paymentDate: 'desc',
    },
  });

  return res.status(200).json(payment);
};

export const getPaymentStats = async (req: Request, res: Response) => {
  const { id: companyId } = QuerySchema.parse(req.query);

  const paymentAll = await prisma.payment.aggregate({
    where: {
      companyId,
    },
    _sum: { amountPaid: true },
    _count: true,
  });

  const paymentECHEANCE = await prisma.payment.aggregate({
    where: {
      companyId,
      type: 'ECHEANCE',
    },
    _count: true,
  });

  const paymentCOMPLET = await prisma.payment.aggregate({
    where: {
      companyId,
      type: 'COMPLET',
    },
    _count: true,
  });

  const result = {
    total: paymentAll._count || 0,
    total_paid: paymentAll._sum.amountPaid || 0,
    total_echeance: paymentECHEANCE._count || 0,
    total_complet: paymentCOMPLET._count || 0,
  };

  res.status(200).json(result);
};
