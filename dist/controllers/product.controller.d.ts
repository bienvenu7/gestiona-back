import type { Request, Response, NextFunction } from 'express';
export declare const createManyProductfromXml: (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
export declare const createOneProduct: (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
export declare const getProducts: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=product.controller.d.ts.map