import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminRequest, logAdminAction } from '@/lib/auth-admin';
import { query } from '@/infrastructure/database/mysql';

// GET - 개별 게시글 조회
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: postId } = await params;

    // Admin 권한 확인
    const admin = await verifyAdminRequest(request);
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    // 게시글 조회
    const posts = await query(
      `SELECT
        p.*,
        c.name as category_name,
        c.type as category_type,
        c.slug as category_slug,
        u.name as author_name,
        u.email as author_email
       FROM posts p
       LEFT JOIN categories c ON p.category_id = c.id
       LEFT JOIN users u ON p.user_id = u.id
       WHERE p.id = ?`,
      [postId]
    );

    if (!posts || (posts as any[]).length === 0) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    const post = (posts as any[])[0];

    // 태그 조회 (태그 테이블이 있다면)
    // const tags = await query(
    //   `SELECT tag FROM post_tags WHERE post_id = ?`,
    //   [postId]
    // );

    return NextResponse.json({
      id: post.id,
      title: post.title,
      content: post.content,
      summary: post.excerpt,
      categoryId: post.category_id,
      categoryType: post.category_type,
      categoryName: post.category_name,
      thumbnailUrl: post.featured_image,
      isNotice: post.is_notice === 1,
      isPublished: post.status === 'published',
      status: post.status,
      views: post.views,
      author: {
        name: post.author_name,
        email: post.author_email
      },
      tags: [], // tags.map(t => t.tag)
      createdAt: post.created_at,
      updatedAt: post.updated_at
    });
  } catch (error) {
    console.error('Admin post fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - 게시글 수정
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: postId } = await params;

    // Admin 권한 확인
    const admin = await verifyAdminRequest(request);
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      title,
      categoryId,
      content,
      summary,
      thumbnailUrl,
      isNotice,
      isPublished,
      tags
    } = body;

    // Validate required fields
    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }

    // Validate thumbnail URL (block base64 data)
    if (thumbnailUrl && thumbnailUrl.startsWith('data:')) {
      return NextResponse.json(
        { error: '썸네일은 URL 형식이어야 합니다. 이미지를 S3에 업로드하거나 외부 URL을 사용하세요.' },
        { status: 400 }
      );
    }

    // 게시글 업데이트
    await query(
      `UPDATE posts SET
        title = ?,
        slug = ?,
        category_id = ?,
        content = ?,
        excerpt = ?,
        featured_image = ?,
        is_notice = ?,
        status = ?,
        published_at = ?,
        updated_at = NOW()
       WHERE id = ?`,
      [
        title,
        title.toLowerCase().replace(/[^a-z0-9가-힣]+/g, '-').replace(/(^-|-$)/g, ''),
        categoryId || null,
        content,
        summary || null,
        thumbnailUrl || null,
        isNotice ? 1 : 0,
        isPublished ? 'published' : 'draft',
        isPublished ? new Date() : null,
        postId
      ]
    );

    // TODO: 태그 업데이트 (태그 테이블이 있다면)
    // if (tags) {
    //   await query(`DELETE FROM post_tags WHERE post_id = ?`, [postId]);
    //   if (tags.length > 0) {
    //     const tagValues = tags.map((tag: string) => [postId, tag]);
    //     await query(
    //       `INSERT INTO post_tags (post_id, tag) VALUES ?`,
    //       [tagValues]
    //     );
    //   }
    // }

    // Log admin action
    await logAdminAction(
      admin.id,
      'UPDATE_POST',
      'posts',
      postId,
      { title, categoryId, isPublished, isNotice },
      request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
      request.headers.get('user-agent')
    );

    return NextResponse.json({
      success: true,
      message: 'Post updated successfully'
    });
  } catch (error) {
    console.error('Admin post update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - 게시글 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: postId } = await params;

    // Admin 권한 확인
    const admin = await verifyAdminRequest(request);
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    // 게시글 정보 가져오기 (로깅용)
    const posts = await query(
      `SELECT title FROM posts WHERE id = ?`,
      [postId]
    );

    if (!posts || (posts as any[]).length === 0) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    const postTitle = (posts as any[])[0].title;

    // 게시글 삭제
    await query(`DELETE FROM posts WHERE id = ?`, [postId]);

    // Log admin action
    await logAdminAction(
      admin.id,
      'DELETE_POST',
      'posts',
      postId,
      { title: postTitle },
      request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
      request.headers.get('user-agent')
    );

    return NextResponse.json({
      success: true,
      message: 'Post deleted successfully'
    });
  } catch (error) {
    console.error('Admin post delete error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}