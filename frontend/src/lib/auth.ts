import jwt from 'jsonwebtoken';

export function verifyToken(token: string) {
  try {
    const secret = process.env.NEXT_PUBLIC_JWT_SECRET;
    if (!secret) {
      throw new Error('JWT secret is not defined');
    }
    return jwt.verify(token, secret);
  } catch {
    return null;
  }
}