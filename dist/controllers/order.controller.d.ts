import type { Request, Response, NextFunction } from 'express';
export declare const createOrder: (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
export declare const getCompanyOrders: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const payOrder: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getPayment: (req: Request, res: Response) => Promise<void>;
export declare const getPaymentStats: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=order.controller.d.ts.map