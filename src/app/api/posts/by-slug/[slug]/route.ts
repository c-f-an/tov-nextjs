import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/infrastructure/database/mysql';

// GET /api/posts/by-slug/[slug] - posts 테이블에서 slug로 게시물 상세 조회
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // 게시물 조회
    const [post] = await query(
      `SELECT
        p.id,
        p.title,
        p.slug,
        p.content,
        p.excerpt,
        p.excerpt as summary,
        p.featured_image,
        p.featured_image as thumbnail,
        p.view_count,
        p.view_count as views,
        p.is_notice,
        p.is_featured,
        p.status,
        p.status = 'published' as is_published,
        p.created_at,
        p.updated_at,
        p.published_at,
        c.name as category_name,
        c.slug as category_slug,
        c.type as category,
        u.name as author_name,
        u.email as author_email
      FROM posts p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN users u ON p.user_id = u.id
      WHERE p.slug = ?`,
      [slug]
    ) as any[];

    if (!post) {
      return NextResponse.json(
        { error: '게시물을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 조회수 증가
    await query(
      'UPDATE posts SET view_count = view_count + 1 WHERE id = ?',
      [post.id]
    );

    // 응답 형식 맞추기
    const formattedPost = {
      id: post.id,
      title: post.title,
      slug: post.slug,
      summary: post.summary || post.excerpt || '',
      content: post.content,
      thumbnail: post.thumbnail || post.featured_image,
      category: post.category,
      categoryName: post.category_name,
      categorySlug: post.category_slug,
      views: (post.views || post.view_count || 0) + 1,
      isPublished: post.is_published,
      isNotice: post.is_notice,
      isFeatured: post.is_featured,
      author: {
        name: post.author_name || '관리자',
        email: post.author_email
      },
      createdAt: post.created_at,
      updatedAt: post.updated_at,
      publishedAt: post.published_at
    };

    return NextResponse.json(formattedPost);
  } catch (error) {
    console.error('Error getting post detail by slug:', error);
    return NextResponse.json(
      { error: '게시물을 불러오는데 실패했습니다.' },
      { status: 500 }
    );
  }
}
