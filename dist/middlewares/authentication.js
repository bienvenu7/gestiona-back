"use strict";
// import { Request, Response, NextFunction } from 'express';
// import jwt, { sign } from 'jsonwebtoken';
// import envConfig from '../config/env.config';
// import { AppError } from '../utils/app.error';
Object.defineProperty(exports, "__esModule", { value: true });
// /**
//  * Interface pour le payload JWT
//  */
// export interface JwtPayload {
//   userId: string;
//   companyId: string;
//   role: string;
//   email: string;
// }
// /**
//  * Extension de Request pour inclure l'utilisateur
//  */
// declare global {
//   // eslint-disable-next-line @typescript-eslint/no-namespace
//   namespace Express {
//     interface Request {
//       user?: JwtPayload;
//     }
//   }
// }
// const accessToken = sign(
//   { id: optCode.id },
//   process.env.JWT_ACCESS_SECRET as string,
//   { expiresIn: 60 * 60 * 8 }
// );
// const refreshToken = sign(
//   { id: optCode.id },
//   process.env.JWT_REFRESH_SECRET as string,
//   { expiresIn: 60 * 60 * 24 * 30 }
// );
//# sourceMappingURL=authentication.js.map