import { NextRequest, NextResponse } from 'next/server';
import { container } from '@/infrastructure/config/container.tsyringe';
import { GetPostsUseCase } from '@/core/application/use-cases/post/GetPostsUseCase';
import { CreatePostUseCase } from '@/core/application/use-cases/post/CreatePostUseCase';
import { withAuth } from '@/presentation/middleware/authMiddleware';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const categoryId = searchParams.get('categoryId');
    const page = searchParams.get('page');
    const limit = searchParams.get('limit');
    const includeNotices = searchParams.get('includeNotices') === 'true';

    const getPostsUseCase = container.resolve(GetPostsUseCase);
    
    const result = await getPostsUseCase.execute({
      categoryId: categoryId ? parseInt(categoryId) : undefined,
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 10,
      includeNotices
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await withAuth(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const createPostUseCase = container.resolve(CreatePostUseCase);
    
    const post = await createPostUseCase.execute({
      ...body,
      userId: user.id
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error: any) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create post' },
      { status: 400 }
    );
  }
}