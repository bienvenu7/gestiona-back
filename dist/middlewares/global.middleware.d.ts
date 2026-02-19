import express from 'express';
import cors from 'cors';
import type { RequestHandler } from 'express';
export declare const limiter: import("express-rate-limit").RateLimitRequestHandler;
export declare const responseTime: (req: express.Request, res: express.Response, next: express.NextFunction) => void;
export declare const compressionConfig: RequestHandler;
export declare const corsConfig: (req: cors.CorsRequest, res: {
    statusCode?: number | undefined;
    setHeader(key: string, value: string): any;
    end(): any;
}, next: (err?: any) => any) => void;
export declare const helmetConfig: (req: import("http").IncomingMessage, res: import("http").ServerResponse, next: (err?: unknown) => void) => void;
export declare const applyMiddleware: (app: express.Application) => void;
//# sourceMappingURL=global.middleware.d.ts.map