import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const host = request.headers.get('host');
  const protocol = request.headers.get('x-forwarded-proto') || 'https';

  const robotsTxt = `# https://www.robotstxt.org/robotstxt.html
User-agent: *
Allow: /

# Allow Naver bot specifically
User-agent: Yeti
Allow: /

# Allow Daum bot
User-agent: Daum
Allow: /

# Allow Google bot
User-agent: Googlebot
Allow: /

# Disallow admin and API routes for all bots
User-agent: *
Disallow: /admin
Disallow: /api/admin
Disallow: /api/auth
Disallow: /api/user

# Sitemap
Sitemap: ${protocol}://${host}/sitemap.xml
`;

  return new NextResponse(robotsTxt, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}