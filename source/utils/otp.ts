import crypto from 'crypto';

export const generateOtp = () =>
  Math.floor(100000 + Math.random() * 900000).toString(); // 6 digits

export const hashOtp = (otp: string) =>
  crypto.createHash('sha256').update(otp).digest('hex');
