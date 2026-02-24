import express from 'express';
import http from 'http';
export declare function getPortFromArgs(): number | null;
export declare const port: number;
export declare const createExpressApp: () => express.Application;
export declare const createHttpServer: (app: express.Application) => http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;
export declare const startServer: (server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>, port: number | string) => void;
//# sourceMappingURL=app.d.ts.map