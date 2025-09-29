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
  const userAgent = request.headers.get('user-agent') || '';

  // Allow search engine bots to access all pages
  const isSearchBot = /Googlebot|Yeti|Daum|bingbot|Slurp|DuckDuckBot|Baiduspider|facebookexternalhit|twitterbot|LinkedInBot|WhatsApp|Slackbot/i.test(userAgent);

  if (isSearchBot) {
    return NextResponse.next();
  }

  // Check if path requires authentication
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path));
  const isAdminPath = adminPaths.some(path => pathname.startsWith(path));
  
  if (isProtectedPath || isAdminPath) {
    // Get access token from Authorization header (for API routes) or cookie (for pages)
    const authHeader = request.headers.get('Authorization');
    let accessToken = authHeader?.replace('Bearer ', '');
    
    // If no Authorization header, check cookies
    if (!accessToken) {
      accessToken = request.cookies.get('accessToken')?.value;
    }
    
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
      
      // Check admin access for admin paths
      if (isAdminPath) {
        // For now, we'll let the admin page component handle role checking
        // This avoids circular dependency issues
        // The admin page will redirect non-admin users
      }
      
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