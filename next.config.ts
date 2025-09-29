import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  compress: true, // gzip 압축 활성화

  // Server response optimization for search bots
  experimental: {
    workerThreads: false,
    cpus: 1
  },

  // Increase timeout for bot requests
  httpAgentOptions: {
    keepAlive: true
  },

  async headers() {
    return [
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      },
      {
        source: '/robots.txt',
        headers: [
          {
            key: 'Content-Type',
            value: 'text/plain; charset=UTF-8'
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, s-maxage=3600'
          }
        ]
      },
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'index, follow'
          }
        ]
      }
    ]
  },
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'tov.ptax.kr',
          },
        ],
        destination: 'https://tov.or.kr/:path*',
        permanent: true,
      },
    ]
  },
  env: {
    NEXT_PUBLIC_KAKAO_MAP_API_KEY: process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY || '',
    NEXT_PUBLIC_COMPANY_ADDRESS: process.env.NEXT_PUBLIC_COMPANY_ADDRESS || ''
  }
};

export default nextConfig;
