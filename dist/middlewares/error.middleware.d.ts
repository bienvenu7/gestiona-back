import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
export declare const errorHandler: (err: Error, req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>>;
export declare const validateRequest: (schemas: {
    body?: ZodSchema;
    query?: ZodSchema;
    params?: ZodSchema;
}) => (req: Request, res: Response, next: NextFunction) => void;
export declare const NotFoundError: (req: Request, res: Response) => Response<any, Record<string, any>>;
//# sourceMappingURL=error.middleware.d.ts.map