import { NextRequest, NextResponse } from 'next/server';
import { container } from '@/infrastructure/config/container.tsyringe';
import { GetPostUseCase } from '@/core/application/use-cases/post/GetPostUseCase';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const postId = parseInt(params.id);
    
    if (isNaN(postId)) {
      return NextResponse.json(
        { error: 'Invalid post ID' },
        { status: 400 }
      );
    }

    const getPostUseCase = container.resolve(GetPostUseCase);
    const post = await getPostUseCase.execute(postId);

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json(
      { error: 'Failed to fetch post' },
      { status: 500 }
    );
  }
}