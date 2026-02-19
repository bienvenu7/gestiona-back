import { sign, verify } from 'jsonwebtoken';
import { IJwtPayload } from '../types/auth';

export const expiredAtFunc = (time: number) => new Date(Date.now() + time);

export const createToken = (
  userData: IJwtPayload,
  secret: string,
  duration: number
) => {
  return sign(userData, secret, {
    expiresIn: duration,
  });
};

export const verifyToken = (token: string, secret: string) => {
  const decoded = verify(token, secret);
  return decoded;
};
