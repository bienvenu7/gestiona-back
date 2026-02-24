import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
export declare const prisma: PrismaClient<{
    log: ("error" | "info" | "query" | "warn")[];
}, never, import("@prisma/client/runtime/library").DefaultArgs>;
export declare function prismaErrorHandler(err: Error, req: Request, res: Response, next: NextFunction): void;
//# sourceMappingURL=db.config.d.ts.map