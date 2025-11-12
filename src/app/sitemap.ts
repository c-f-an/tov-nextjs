import { MetadataRoute } from 'next'
import { query } from '@/infrastructure/database/mysql'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://tov.or.kr'
  const skipDB = process.env.SKIP_DB_QUERIES === 'true'

  // 정적 페이지들
  const staticPages = [
    { path: '', priority: 1 },
    { path: '/about', priority: 0.8 },
    { path: '/about/greeting', priority: 0.8 },
    { path: '/about/business', priority: 0.8 },
    { path: '/about/organization', priority: 0.8 },
    { path: '/about/location', priority: 0.8 },
    { path: '/about/faq', priority: 0.8 },
    { path: '/movement', priority: 0.8 },
    { path: '/movement/financial-management', priority: 0.8 },
    { path: '/movement/financial-education', priority: 0.8 },
    { path: '/movement/financial-disclosure', priority: 0.8 },
    { path: '/movement/religious-income-report', priority: 0.8 },
    { path: '/movement/cooperation', priority: 0.8 },
    { path: '/news', priority: 0.8 },
    { path: '/news/notice', priority: 0.8 },
    { path: '/news/activity', priority: 0.8 },
    { path: '/news/media', priority: 0.8 },
    { path: '/news/publication', priority: 0.8 },
    { path: '/news/laws', priority: 0.8 },
    { path: '/resources', priority: 0.8 },
    { path: '/resources/religious-income', priority: 0.8 },
    { path: '/resources/nonprofit-finance', priority: 0.8 },
    { path: '/resources/settlement', priority: 0.8 },
    { path: '/consultation', priority: 0.8 },
    { path: '/consultation/apply', priority: 0.8 },
    { path: '/consultation/guide', priority: 0.8 },
    { path: '/donation', priority: 0.8 },
    { path: '/donation/guide', priority: 0.8 },
    { path: '/donation/apply', priority: 0.8 },
    { path: '/donation/report', priority: 0.8 },
    { path: '/mypage', priority: 0.5 },
    { path: '/login', priority: 0.5 },
    { path: '/register', priority: 0.5 },
    { path: '/sitemap', priority: 0.5 },
    { path: '/privacy', priority: 0.5 },
    { path: '/terms', priority: 0.5 },
  ]

  // 정적 페이지 사이트맵 엔트리 생성
  const staticUrls: MetadataRoute.Sitemap = staticPages.map(({ path, priority }) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority,
  }))

  // 빌드 시 DB 쿼리 스킵
  if (skipDB) {
    return staticUrls
  }

  // 동적 콘텐츠 가져오기
  try {
    // 게시글 가져오기
    const posts = await query<{id: number, slug: string, updated_at: Date, category_slug: string}[]>(`
      SELECT p.id, p.slug, p.updated_at, c.slug as category_slug
      FROM posts p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.status = 'published'
      ORDER BY p.updated_at DESC
      LIMIT 1000
    `)

    const postUrls: MetadataRoute.Sitemap = posts.map((post) => ({
      url: `${baseUrl}/board/${post.category_slug}/${post.id}`,
      lastModified: new Date(post.updated_at),
      changeFrequency: 'weekly',
      priority: 0.6,
    }))

    // 상담 사례는 비공개로 처리하므로 sitemap에서 제외
    const consultationUrls: MetadataRoute.Sitemap = []


    // 비즈니스 보고서 가져오기 (reports 테이블 사용)
    const businessReports = await query<{id: number, type: string, updated_at: Date}[]>(`
      SELECT id, type, updated_at
      FROM reports
      WHERE is_active = 1
      ORDER BY updated_at DESC
      LIMIT 200
    `)

    const reportUrls: MetadataRoute.Sitemap = businessReports.map((report) => ({
      url: `${baseUrl}/about/business/${report.type}/${report.id}`,
      lastModified: new Date(report.updated_at),
      changeFrequency: 'yearly',
      priority: 0.5,
    }))

    return [
      ...staticUrls,
      ...postUrls,
      ...consultationUrls,
      ...reportUrls,
    ]
  } catch (error) {
    console.error('Error fetching dynamic content for sitemap:', error)
    // DB 오류 시 최소한 정적 페이지만이라도 반환
    return staticUrls
  }
}