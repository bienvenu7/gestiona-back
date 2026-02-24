import { IJwtPayload } from '../types/auth';
export declare const expiredAtFunc: (time: number) => Date;
export declare const createToken: (userData: IJwtPayload, secret: string, duration: number) => string;
export declare const verifyToken: (token: string, secret: string) => string | import("jsonwebtoken").JwtPayload;
//# sourceMappingURL=jwt.config.d.ts.map