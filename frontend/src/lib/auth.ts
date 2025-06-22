import jwt from 'jsonwebtoken';

export function verifyToken(token: string) {
  try {
    const secret = process.env.NEXT_PUBLIC_JWT_SECRET!;
    return jwt.verify(token, secret);
  } catch {
    return null;
  }
}