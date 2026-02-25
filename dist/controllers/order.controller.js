"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPaymentStats = exports.getPayment = exports.payOrder = exports.getCompanyOrders = exports.createOrder = void 0;
const company_schema_1 = require("../schema/company.schema");
const db_config_1 = require("../config/db.config");
const app_error_1 = require("../utils/app.error");
const server_1 = require("../server");
//
const createOrder = async (req, res, next) => {
    const { carts, order } = company_schema_1.CreateOrderWithCart.parse(req.body);
    //verification du stock des produits
    const findProducts = await db_config_1.prisma.product.findMany({
        where: {
            id: { in: carts.map(c => c.productId) },
        },
        select: {
            id: true,
            stockQuantity: true,
            name: true,
        },
    });
    const productMap = new Map(findProducts.map(p => [p.id, p]));
    const invalidItem = carts.find(cart => {
        const product = productMap.get(cart.productId);
        return !product || cart.quantity > product.stockQuantity;
    });
    if (invalidItem) {
        const product = productMap.get(invalidItem.productId);
        return next(new app_error_1.AppError(`Nous n'avons plus assez de stock de ${product?.stockQuantity}`, 400));
    }
    //creation de l'ordre
    const orderNumber = new Date().getTime().toString();
    const createOrder = await db_config_1.prisma.order.create({
        data: {
            ...order,
            orderNumber,
            products: {
                createMany: { data: carts, skipDuplicates: true },
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
    server_1.io.to(`${order.companyId}`).emit('order-created', createOrder);
    return res.status(201).json(createOrder);
};
exports.createOrder = createOrder;
const getCompanyOrders = async (req, res) => {
    const { id, clientName, endDate, startDate } = company_schema_1.QuerySchema.parse(req.query);
    if (clientName !== undefined && startDate && endDate) {
        const orders = await db_config_1.prisma.order.findMany({
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
        const orders = await db_config_1.prisma.order.findMany({
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
        const orders = await db_config_1.prisma.order.findMany({
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
    const orders = await db_config_1.prisma.order.findMany({
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
exports.getCompanyOrders = getCompanyOrders;
const payOrder = async (req, res) => {
    const paymentData = company_schema_1.CreatePaymentSchema.parse(req.body);
    const result = await db_config_1.prisma.$transaction(async (ctx) => {
        const actuelOrder = await ctx.order.findUnique({
            where: {
                orderNumber: paymentData.orderNumber,
            },
        });
        if (!actuelOrder) {
            throw new app_error_1.AppError('Aucune commande correspondante', 400);
        }
        const remainingAmount = actuelOrder.totalAmount - actuelOrder.paidAmount;
        if (paymentData.amountPaid > remainingAmount) {
            throw new app_error_1.AppError('Le montant dépasse le reste à payer', 400, [
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
        }
        else {
            paymentNumber = `PAY-${parseInt(lastPayment.paymentNumber.split('-')[1]) + 1}`;
        }
        const payement = await ctx.payment.create({
            data: { ...paymentData, paymentNumber },
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
    }, { timeout: 10000 });
    server_1.io.to(paymentData.companyId).emit('Created-payement', result.payement);
    return res.status(201).json(result.order);
};
exports.payOrder = payOrder;
const getPayment = async (req, res) => {
    const { id: companyId } = company_schema_1.QuerySchema.parse(req.query);
    const payment = await db_config_1.prisma.payment.findMany({
        where: {
            companyId,
        },
    });
    res.status(200).json(payment);
};
exports.getPayment = getPayment;
const getPaymentStats = async (req, res) => {
    const { id: companyId } = company_schema_1.QuerySchema.parse(req.query);
    const paymentAll = await db_config_1.prisma.payment.aggregate({
        where: {
            companyId,
        },
        _sum: { amountPaid: true },
        _count: true,
    });
    const paymentECHEANCE = await db_config_1.prisma.payment.aggregate({
        where: {
            companyId,
            type: 'ECHEANCE',
        },
        _count: true,
    });
    const paymentCOMPLET = await db_config_1.prisma.payment.aggregate({
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
exports.getPaymentStats = getPaymentStats;
//# sourceMappingURL=order.controller.js.map