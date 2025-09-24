import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Middleware configuration
export const config = {
  matcher: [
    // Match all API routes
    "/api/:path*",
    // Match all app routes except static files
    "/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.svg$|.*\\.css$|.*\\.js$).*)",
  ],
};

// Track last health check time
let lastHealthCheckTime = 0;
const HEALTH_CHECK_INTERVAL = 60000; // 1 minute

export async function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const now = Date.now();

  // Skip health check endpoint itself to avoid infinite loop
  if (url.pathname === "/api/health") {
    return NextResponse.next();
  }

  // For API routes, perform periodic health checks
  if (url.pathname.startsWith("/api/")) {
    // Check if it's time for a health check (every minute)
    if (now - lastHealthCheckTime > HEALTH_CHECK_INTERVAL) {
      lastHealthCheckTime = now;

      // Trigger health check in background (non-blocking)
      const healthCheckUrl = new URL("/api/health", request.url);

      // Use fetch with a short timeout to avoid blocking requests
      fetch(healthCheckUrl.toString(), {
        method: "GET",
        signal: AbortSignal.timeout(5000), // 5 second timeout
      })
        .then((res) => {
          if (!res.ok) {
            console.warn(`[Middleware] Health check returned status ${res.status}`);
          } else {
            console.log("[Middleware] Background health check successful");
          }
        })
        .catch((error) => {
          console.error("[Middleware] Background health check failed:", error.message);
        });
    }
  }

  // For production, add connection refresh on certain conditions
  if (process.env.NODE_ENV === "production") {
    // Check if this is a database-heavy API route
    const dbIntensiveRoutes = [
      "/api/posts",
      "/api/news",
      "/api/donations",
      "/api/consultations",
      "/api/financial-reports",
      "/api/menus",
      "/api/sponsors",
      "/api/users",
      "/api/auth"
    ];

    const isDatabaseRoute = dbIntensiveRoutes.some(route =>
      url.pathname.startsWith(route)
    );

    if (isDatabaseRoute) {
      // Add a header to track database requests
      const response = NextResponse.next();
      response.headers.set("X-DB-Route", "true");
      response.headers.set("X-Health-Check-Interval", HEALTH_CHECK_INTERVAL.toString());

      // For critical routes, ensure connection is fresh
      if (url.pathname.includes("/auth") || url.pathname.includes("/donations")) {
        // Trigger a connection refresh for critical operations
        const healthCheckUrl = new URL("/api/health", request.url);

        fetch(healthCheckUrl.toString(), {
          method: "POST",
          body: JSON.stringify({ action: "reconnect" }),
          headers: { "Content-Type": "application/json" },
          signal: AbortSignal.timeout(3000), // 3 second timeout
        }).catch(() => {
          // Silent fail - don't block the request
        });
      }

      return response;
    }
  }

  // Add cache control headers for static pages
  const response = NextResponse.next();

  // Disable caching for dynamic content
  if (url.pathname.startsWith("/api/") || url.pathname.includes("admin")) {
    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "0");
  }

  // Add security headers
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  return response;
}