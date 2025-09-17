import { NextRequest, NextResponse } from 'next/server';
import { MySQLNewsRepository } from '@/infrastructure/repositories/MySQLNewsRepository';
import { GetNewsDetailUseCase } from '@/core/application/use-cases/news/GetNewsDetailUseCase';
import { UpdateNewsUseCase } from '@/core/application/use-cases/news/UpdateNewsUseCase';
import { DeleteNewsUseCase } from '@/core/application/use-cases/news/DeleteNewsUseCase';

const newsRepository = new MySQLNewsRepository();

// GET /api/news/[id] - 뉴스 상세 조회
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const getNewsDetailUseCase = new GetNewsDetailUseCase(newsRepository);
    const news = await getNewsDetailUseCase.execute(id);

    if (!news) {
      return NextResponse.json(
        { error: '뉴스를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    return NextResponse.json(news);
  } catch (error) {
    console.error('Error getting news detail:', error);
    return NextResponse.json(
      { error: '뉴스를 불러오는데 실패했습니다.' },
      { status: 500 }
    );
  }
}

// PUT /api/news/[id] - 뉴스 수정 (관리자만)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // TODO: 관리자 권한 체크
    const id = parseInt(params.id);
    const body = await request.json();

    const updateNewsUseCase = new UpdateNewsUseCase(newsRepository);
    const news = await updateNewsUseCase.execute(id, body);

    return NextResponse.json(news);
  } catch (error: any) {
    console.error('Error updating news:', error);
    if (error.message === '뉴스를 찾을 수 없습니다.') {
      return NextResponse.json(
        { error: error.message },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: '뉴스 수정에 실패했습니다.' },
      { status: 500 }
    );
  }
}

// DELETE /api/news/[id] - 뉴스 삭제 (관리자만)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // TODO: 관리자 권한 체크
    const id = parseInt(params.id);

    const deleteNewsUseCase = new DeleteNewsUseCase(newsRepository);
    await deleteNewsUseCase.execute(id);

    return NextResponse.json({ message: '뉴스가 삭제되었습니다.' });
  } catch (error: any) {
    console.error('Error deleting news:', error);
    if (error.message === '뉴스를 찾을 수 없습니다.') {
      return NextResponse.json(
        { error: error.message },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: '뉴스 삭제에 실패했습니다.' },
      { status: 500 }
    );
  }
}