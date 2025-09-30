import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api/admin', '/api/auth', '/api/user'],
      },
      {
        userAgent: 'Yeti', // Naver bot
        allow: '/',
      },
      {
        userAgent: 'Daum',
        allow: '/',
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
      },
    ],
    sitemap: 'https://tov.or.kr/sitemap.xml',
  }
}