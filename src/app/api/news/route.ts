import { NextRequest, NextResponse } from 'next/server';
import { MySQLNewsRepository } from '@/infrastructure/repositories/MySQLNewsRepository';
import { CreateNewsUseCase } from '@/core/application/use-cases/news/CreateNewsUseCase';
import { GetNewsListUseCase } from '@/core/application/use-cases/news/GetNewsListUseCase';
import { NewsCategory } from '@/core/domain/entities/News';

const newsRepository = new MySQLNewsRepository();

// GET /api/news - 뉴스 목록 조회
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    const params = {
      category: searchParams.get('category') as NewsCategory | undefined,
      searchTerm: searchParams.get('search') || undefined,
      sortBy: (searchParams.get('sort') as 'latest' | 'popular') || 'latest',
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '12'),
      isPublished: searchParams.get('published') === 'false' ? false : true,
    };

    const getNewsListUseCase = new GetNewsListUseCase(newsRepository);
    const result = await getNewsListUseCase.execute(params);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error getting news list:', error);
    return NextResponse.json(
      { error: '뉴스 목록을 불러오는데 실패했습니다.' },
      { status: 500 }
    );
  }
}

// POST /api/news - 뉴스 생성 (관리자만)
export async function POST(request: NextRequest) {
  try {
    // TODO: 관리자 권한 체크
    const body = await request.json();

    const createNewsUseCase = new CreateNewsUseCase(newsRepository);
    const news = await createNewsUseCase.execute(body);

    return NextResponse.json(news, { status: 201 });
  } catch (error) {
    console.error('Error creating news:', error);
    return NextResponse.json(
      { error: '뉴스 생성에 실패했습니다.' },
      { status: 500 }
    );
  }
}