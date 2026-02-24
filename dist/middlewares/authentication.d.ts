import { Request, Response, NextFunction } from 'express';
import { IJwtPayload } from '../types/auth';
/**
 * Extension de Request pour inclure l'utilisateur
 */
declare global {
    namespace Express {
        interface Request {
            user?: IJwtPayload;
        }
    }
}
export declare const isAuhenticated: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const isPermitted: (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=authentication.d.ts.map