import { IJwtPayload } from '../types/auth';
export declare const expiredAtFunc: (time: number) => Date;
export declare const createToken: (userData: IJwtPayload, secret: string, duration: number) => string;
//# sourceMappingURL=jwt.config.d.ts.map