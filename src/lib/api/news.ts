import { NewsListResponse, NewsCategory } from '@/core/domain/entities/News';

const getApiUrl = () => {
  if (typeof window === 'undefined') {
    // 서버 사이드 - 환경변수 사용 (없으면 로컬호스트)
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || `http://localhost:${process.env.PORT || 3004}/api`;
    return apiUrl.replace(/^["']|["']$/g, '');
  }
  // 클라이언트 사이드
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || '/api';
  return apiUrl.replace(/^["']|["']$/g, '');
};

export interface NewsApiParams {
  category?: NewsCategory;
  search?: string;
  sort?: 'latest' | 'popular';
  page?: number;
  limit?: number;
}

export async function fetchNewsList(params: NewsApiParams): Promise<NewsListResponse> {
  try {
    const searchParams = new URLSearchParams();
    
    if (params.category) searchParams.append('category', params.category);
    if (params.search) searchParams.append('search', params.search);
    if (params.sort) searchParams.append('sort', params.sort);
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());

    const apiUrl = getApiUrl();
    const response = await fetch(`${apiUrl}/news?${searchParams.toString()}`, {
      next: { revalidate: 60 }, // 1분 캐시
    });

    if (!response.ok) {
      console.error('Failed to fetch news:', response.status, response.statusText);
      // 에러 발생 시 빈 데이터 반환
      return {
        items: [],
        total: 0,
        page: 1,
        totalPages: 0,
      };
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching news list:', error);
    // 네트워크 에러 등의 경우 빈 데이터 반환
    return {
      items: [],
      total: 0,
      page: 1,
      totalPages: 0,
    };
  }
}

export async function fetchNewsDetail(id: number) {
  try {
    const apiUrl = getApiUrl();
    const response = await fetch(`${apiUrl}/news/${id}`, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch news detail');
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching news detail:', error);
    return null;
  }
}