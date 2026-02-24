import type { Request, Response, NextFunction } from 'express';
export declare const registerCP: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const verifyHash: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const createUser: (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
export declare const getUsers: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const deleteUser: (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
export declare const updateUserStatus: (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
//# sourceMappingURL=company.controller.d.ts.map