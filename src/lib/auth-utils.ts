import jwt from 'jsonwebtoken';

export interface TokenPayload {
  userId: number;
  email: string;
  loginType: string;
}

export function verifyAccessToken(token: string, secret: string): TokenPayload | null {
  try {
    const decoded = jwt.verify(token, secret) as TokenPayload;
    return decoded;
  } catch {
    return null;
  }
}