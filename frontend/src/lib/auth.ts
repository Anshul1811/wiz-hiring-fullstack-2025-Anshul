import jwt from 'jsonwebtoken';

export function verifyToken(token: string) {
  try {
    const secret = "Anshul";
    return jwt.verify(token, secret);
  } catch {
    return null;
  }
}
