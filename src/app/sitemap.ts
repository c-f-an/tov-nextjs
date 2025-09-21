import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://tov.ptax.kr'
  
  // 정적 페이지들
  const staticPages = [
    '',
    '/about',
    '/about/greeting',
    '/about/business',
    '/about/organization',
    '/about/location',
    '/about/faq',
    '/board',
    '/board/notice',
    '/board/news',
    '/board/media',
    '/board/publication',
    '/board/resource',
    '/board/activity',
    '/resources',
    '/resources/religious-income',
    '/resources/nonprofit-finance',
    '/resources/settlement',
    '/resources/laws',
    '/consultation',
    '/consultation/apply',
    '/consultation/guide',
    '/consultation/list',
    '/consultation/faq',
    '/donation',
    '/donation/guide',
    '/donation/apply',
    '/donation/report',
    '/education',
    '/movement',
    '/movement/religious-income-report',
    '/movement/financial-management',
    '/movement/financial-education',
    '/movement/financial-disclosure',
    '/movement/cooperation',
    '/news',
    '/news/notice',
    '/news/activity',
    '/news/media',
    '/news/publication',
    '/news/laws',
    '/faq',
    '/sitemap',
    '/privacy',
    '/terms',
    '/login',
    '/register',
  ]

  // 정적 페이지 사이트맵 엔트리 생성
  const staticUrls = staticPages.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  // 동적 페이지들을 위한 데이터 페칭이 필요한 경우
  // 예: 게시글, 뉴스 등의 상세 페이지
  // const posts = await fetchPosts() // 실제 데이터 페칭 로직 필요
  // const dynamicUrls = posts.map((post) => ({
  //   url: `${baseUrl}/board/notice/${post.id}`,
  //   lastModified: post.updatedAt,
  //   changeFrequency: 'weekly' as const,
  //   priority: 0.6,
  // }))

  return [
    ...staticUrls,
    // ...dynamicUrls, // 동적 URL 추가 시 주석 해제
  ]
}