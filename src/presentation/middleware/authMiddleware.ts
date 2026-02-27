import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

interface JwtPayload {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
}

export interface AuthRequest extends NextRequest {
  user?: JwtPayload;
}

export function withAuth(handler: (req: AuthRequest) => Promise<NextResponse>) {
  return async (req: NextRequest) => {
    try {
      const token = req.headers.get('authorization')?.replace('Bearer ', '');

      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as JwtPayload;
        (req as AuthRequest).user = decoded;
      }

      return handler(req as AuthRequest);
    } catch {
      return handler(req as AuthRequest);
    }
  };
}

export async function getAuthUser(request: NextRequest): Promise<JwtPayload | null> {
  try {
    const token = request.cookies.get('accessToken')?.value ||
      request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) return null;
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as JwtPayload;
    return decoded;
  } catch {
    return null;
  }
}