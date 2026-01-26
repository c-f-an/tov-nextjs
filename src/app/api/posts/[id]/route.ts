import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/infrastructure/database/mysql';

// GET /api/posts/[id] - posts 테이블에서 게시물 상세 조회
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);

    // 조회수 증가
    await query(
      'UPDATE posts SET view_count = view_count + 1 WHERE id = ?',
      [id]
    );

    // 뉴스 상세 조회
    const [news] = await query(
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
      WHERE p.id = ?`,
      [id]
    ) as any[];

    if (!news) {
      return NextResponse.json(
        { error: '뉴스를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 응답 형식 맞추기 (기존 news API와 호환)
    const formattedNews = {
      id: news.id,
      title: news.title,
      slug: news.slug,
      summary: news.summary || news.excerpt || '',
      content: news.content,
      thumbnail: news.thumbnail || news.featured_image,
      category: news.category,
      categoryName: news.category_name,
      categorySlug: news.category_slug,
      views: news.views || news.view_count || 0,
      isPublished: news.is_published,
      isNotice: news.is_notice,
      isFeatured: news.is_featured,
      author: {
        name: news.author_name || '관리자',
        email: news.author_email
      },
      createdAt: news.created_at,
      updatedAt: news.updated_at,
      publishedAt: news.published_at
    };

    return NextResponse.json(formattedNews);
  } catch (error) {
    console.error('Error getting news detail:', error);
    return NextResponse.json(
      { error: '뉴스를 불러오는데 실패했습니다.' },
      { status: 500 }
    );
  }
}

// PUT /api/posts/[id] - 게시물 수정 (관리자만)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // TODO: 관리자 권한 체크
    const { id: idParam } = await params;
    const id = parseInt(idParam);
    const body = await request.json();
    const {
      title,
      content,
      summary,
      thumbnail,
      isPublished,
      isNotice,
      isFeatured
    } = body;

    // 뉴스 업데이트
    await query(
      `UPDATE posts SET
        title = ?,
        slug = ?,
        content = ?,
        excerpt = ?,
        featured_image = ?,
        is_notice = ?,
        is_featured = ?,
        status = ?,
        published_at = CASE WHEN ? = 'published' AND published_at IS NULL THEN NOW() ELSE published_at END,
        updated_at = NOW()
      WHERE id = ?`,
      [
        title,
        title.toLowerCase().replace(/[^a-z0-9가-힣]+/g, '-').replace(/(^-|-$)/g, ''),
        content,
        summary || null,
        thumbnail || null,
        isNotice ? 1 : 0,
        isFeatured ? 1 : 0,
        isPublished ? 'published' : 'draft',
        isPublished ? 'published' : 'draft',
        id
      ]
    );

    // 업데이트된 뉴스 조회
    const [updated] = await query(
      `SELECT
        p.*,
        c.name as category_name,
        c.slug as category_slug,
        c.type as category
      FROM posts p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = ?`,
      [id]
    ) as any[];

    return NextResponse.json({
      id: updated.id,
      title: updated.title,
      slug: updated.slug,
      summary: updated.excerpt,
      content: updated.content,
      thumbnail: updated.featured_image,
      category: updated.category,
      categoryName: updated.category_name,
      categorySlug: updated.category_slug,
      views: updated.view_count,
      isPublished: updated.status === 'published',
      isNotice: updated.is_notice,
      isFeatured: updated.is_featured,
      createdAt: updated.created_at,
      updatedAt: updated.updated_at,
      publishedAt: updated.published_at
    });
  } catch (error: any) {
    console.error('Error updating news:', error);
    return NextResponse.json(
      { error: '뉴스 수정에 실패했습니다.' },
      { status: 500 }
    );
  }
}

// DELETE /api/posts/[id] - 게시물 삭제 (관리자만)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // TODO: 관리자 권한 체크
    const { id: idParam } = await params;
    const id = parseInt(idParam);

    // 뉴스 존재 여부 확인
    const [existing] = await query(
      'SELECT id FROM posts WHERE id = ?',
      [id]
    ) as any[];

    if (!existing) {
      return NextResponse.json(
        { error: '뉴스를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 뉴스 삭제
    await query('DELETE FROM posts WHERE id = ?', [id]);

    return NextResponse.json({ message: '뉴스가 삭제되었습니다.' });
  } catch (error: any) {
    console.error('Error deleting news:', error);
    return NextResponse.json(
      { error: '뉴스 삭제에 실패했습니다.' },
      { status: 500 }
    );
  }
}