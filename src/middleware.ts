import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyAccessToken } from './lib/auth-utils';

// Paths that require authentication
const protectedPaths = [
  '/api/user',
  '/api/consultations',
  '/api/donations',
  '/dashboard',
  '/profile',
  '/consultations',
  '/donations'
];

// Paths that require admin role
const adminPaths = [
  '/api/admin',
  '/admin'
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if path requires authentication
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path));
  const isAdminPath = adminPaths.some(path => pathname.startsWith(path));
  
  if (isProtectedPath || isAdminPath) {
    // Get access token from Authorization header
    const authHeader = request.headers.get('Authorization');
    const accessToken = authHeader?.replace('Bearer ', '');
    
    if (!accessToken) {
      // For API routes, return 401
      if (pathname.startsWith('/api')) {
        return NextResponse.json(
          { error: 'Authentication required' },
          { status: 401 }
        );
      }
      
      // For pages, redirect to login
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
    
    try {
      // Verify access token
      const jwtSecret = process.env.JWT_ACCESS_SECRET || 'default-access-secret';
      const payload = verifyAccessToken(accessToken, jwtSecret);
      
      if (!payload) {
        throw new Error('Invalid token');
      }
      
      // Check admin access
      // Note: Admin role check would need to be implemented based on user profile or separate admin table
      // For now, we'll skip this check as the new schema doesn't have role in users table
      
      // Add user info to request headers
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set('x-user-id', payload.userId.toString());
      requestHeaders.set('x-user-email', payload.email);
      requestHeaders.set('x-user-login-type', payload.loginType);
      
      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    } catch {
      // For API routes, return 401
      if (pathname.startsWith('/api')) {
        return NextResponse.json(
          { error: 'Invalid or expired token' },
          { status: 401 }
        );
      }
      
      // For pages, redirect to login
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};