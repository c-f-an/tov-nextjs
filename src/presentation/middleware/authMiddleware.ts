import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends NextRequest {
  user?: any;
}

export function withAuth(handler: (req: AuthRequest) => Promise<NextResponse>) {
  return async (req: NextRequest) => {
    try {
      const token = req.headers.get('authorization')?.replace('Bearer ', '');
      
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET!);
        (req as AuthRequest).user = decoded;
      }
      
      return handler(req as AuthRequest);
    } catch (error) {
      return handler(req as AuthRequest);
    }
  };
}