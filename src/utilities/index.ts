import jwt from 'jsonwebtoken';
import crypto from 'crypto';

export const createToken = (data: any, maxAge?: string) => {
  const secret = process.env.SECRET || '';
  return jwt.sign({data}, secret, {
    expiresIn: maxAge || '1d',
  });
};

export const decodeToken = (data: string) => {
  try {
    const secret = process.env.TOKEN_SECRET || '';
    const decodedToken = jwt.verify(data, secret) as any;
    return decodedToken;
  } catch (error) {
    return null;
  }
};

export const removeObjectDuplicate = (arrayOfObjects: any[], key: string) => {
  const result = [...new Set(arrayOfObjects?.map(obj => obj?.[key]))]?.map(id =>
    arrayOfObjects?.find(obj => obj?.[key] === id)
  );
  return result;
};

export const getOTP = () => {
  const buffer = crypto.randomBytes(3);
  const otp = buffer.toString('hex');

  return otp;
};
