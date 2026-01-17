import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyAccessToken } from './lib/auth-utils';

// Paths that require authentication - DISABLED: Auth is handled in API routes
const protectedPaths: string[] = [
  // '/api/user',
  // '/api/consultations',
  // '/api/donations'
];

// Paths that require admin role - DISABLED: Auth is handled in API routes
const adminPaths: string[] = [
  // '/api/admin'
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const userAgent = request.headers.get('user-agent') || '';
  const clientIP = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '';

  // Production에서는 로그 비활성화 (성능 최적화)
  const isDev = process.env.NODE_ENV === 'development';
  if (isDev) {
    console.log('Middleware: Request received', { pathname });
  }

  // Skip middleware for static assets and Next.js internals
  if (pathname.startsWith('/_next') ||
      pathname.startsWith('/static') ||
      pathname.includes('.') && !pathname.endsWith('.html')) {
    return NextResponse.next();
  }

  // Allow search engine bots to access all pages
  // Naver bot User-Agents: Yeti, NaverBot, Yeti-Mobile
  const searchBotPatterns = [
    /Googlebot/i,
    /Yeti/i,           // Naver desktop bot
    /NaverBot/i,       // Alternative Naver bot
    /Yeti-Mobile/i,    // Naver mobile bot
    /Daum/i,
    /bingbot/i,
    /Slurp/i,
    /DuckDuckBot/i,
    /Baiduspider/i,
    /facebookexternalhit/i,
    /twitterbot/i,
    /LinkedInBot/i,
    /WhatsApp/i,
    /Slackbot/i,
    /kakaotalk-scrap/i,
    /KOCMOHABT/i,      // Naver Blog bot
    /yeti/i,           // Case insensitive Yeti
    /naver\.me\/bot/i  // Naver.me bot
  ];

  const isSearchBot = searchBotPatterns.some(pattern => pattern.test(userAgent));

  // Naver bot IP ranges (partial list for reference)
  // Full list: https://searchadvisor.naver.com/guide/seo-basic-robots
  const naverBotIPs = [
    '125.209.', // Naver IP prefix
    '211.249.', // Naver IP prefix
    '222.122.', // Naver IP prefix
    '61.247.',  // Naver IP prefix
  ];

  const isNaverBotIP = naverBotIPs.some(prefix => clientIP.startsWith(prefix));

  if (isSearchBot || isNaverBotIP) {
    // Allow bots without authentication and with optimized headers
    const response = NextResponse.next();
    response.headers.set('X-Robots-Tag', 'index, follow');
    response.headers.set('Cache-Control', 'public, max-age=3600');
    return response;
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

    console.log('Middleware: Checking auth', {
      pathname,
      hasAuthHeader: !!authHeader,
      hasAccessToken: !!accessToken,
      isAdminPath,
      isProtectedPath
    });

    if (!accessToken) {
      console.log('Middleware: No access token found');
      // For API routes, return 401
      if (pathname.startsWith('/api')) {
        return NextResponse.json(
          { error: 'Authentication required' },
          { status: 401 }
        );
      }

      // For pages, allow access (client-side will handle redirect)
      // This is because cookies might not be working properly
      console.log('Middleware: Allowing access without token - client will handle auth');
      return NextResponse.next();
    }
    
    try {
      // Verify access token
      const jwtSecret = process.env.JWT_ACCESS_SECRET || 'default-access-secret';
      const payload = verifyAccessToken(accessToken, jwtSecret);

      if (!payload) {
        throw new Error('Invalid token');
      }

      console.log('Middleware: Token verified', { userId: payload.userId, role: payload.role, pathname });

      // Check admin access for admin paths
      if (isAdminPath) {
        console.log('Middleware: Checking admin access', { role: payload.role, pathname });
        if (payload.role !== 'ADMIN') {
          console.log('Middleware: Access denied - not admin');
          // For API routes, return 403
          if (pathname.startsWith('/api')) {
            return NextResponse.json(
              { error: 'Admin access required' },
              { status: 403 }
            );
          }

          // For pages, redirect to home
          return NextResponse.redirect(new URL('/', request.url));
        }
        console.log('Middleware: Admin access granted');
      }
      
      // Add user info to request headers
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set('x-user-id', payload.userId.toString());
      requestHeaders.set('x-user-email', payload.email);
      requestHeaders.set('x-user-login-type', payload.loginType);
      requestHeaders.set('x-user-role', payload.role || 'USER');
      
      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    } catch (error) {
      console.log('Middleware: Token verification failed', error);
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
     * Match only specific paths that need middleware processing:
     * - API routes (except health check)
     * - Pages that require auth checks
     * Excludes: static files, images, fonts, etc.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:jpg|jpeg|png|gif|svg|ico|webp|woff|woff2|ttf|eot|css|js|map)$).*)',
  ],
};