import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminRequest, logAdminAction } from '@/lib/auth-admin';
import { query } from '@/infrastructure/database/mysql';

export async function GET(request: NextRequest) {
  try {
    // Verify admin access
    const admin = await verifyAdminRequest(request);
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const categoryId = searchParams.get('categoryId');
    const searchTerm = searchParams.get('search');
    const status = searchParams.get('status');
    const sortBy = searchParams.get('sort') || 'latest';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    // 기본 쿼리 - 관리자는 모든 상태 조회 가능
    let whereConditions: string[] = [];
    let queryParams: any[] = [];

    // 상태 필터
    if (status) {
      whereConditions.push('p.status = ?');
      queryParams.push(status);
    }

    // 카테고리 ID 필터
    if (categoryId) {
      whereConditions.push('p.category_id = ?');
      queryParams.push(parseInt(categoryId));
    }
    // 카테고리 필터 - slug 또는 type으로 검색
    else if (category) {
      whereConditions.push('(c.type = ? OR c.slug = ?)');
      queryParams.push(category, category);
    }

    // 검색어 필터
    if (searchTerm) {
      whereConditions.push('(p.title LIKE ? OR p.content LIKE ?)');
      queryParams.push(`%${searchTerm}%`, `%${searchTerm}%`);
    }

    const whereClause = whereConditions.length > 0
      ? `WHERE ${whereConditions.join(' AND ')}`
      : '';

    // 전체 개수 조회
    const countQuery = `
      SELECT COUNT(*) as total
      FROM posts p
      LEFT JOIN categories c ON p.category_id = c.id
      ${whereClause}
    `;

    const [countResult] = await query(countQuery, queryParams) as any;
    const total = countResult.total;

    // 정렬 설정
    let orderBy = 'p.created_at DESC';
    if (sortBy === 'popular') {
      orderBy = 'p.view_count DESC, p.created_at DESC';
    }

    // 페이지네이션 계산
    const offset = (page - 1) * limit;

    // 데이터 조회
    const dataQuery = `
      SELECT
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
      ${whereClause}
      ORDER BY ${orderBy}
      LIMIT ? OFFSET ?
    `;

    queryParams.push(limit, offset);
    const items = await query(dataQuery, queryParams) as any[];

    // 응답 형식
    const formattedItems = items.map(item => ({
      id: item.id,
      title: item.title,
      slug: item.slug,
      summary: item.summary || item.excerpt || '',
      content: item.content,
      thumbnail: item.thumbnail || item.featured_image,
      category: item.category,
      categoryName: item.category_name,
      categorySlug: item.category_slug,
      views: item.views || item.view_count || 0,
      status: item.status,
      isPublished: Boolean(item.is_published),
      isNotice: Boolean(item.is_notice),
      isFeatured: Boolean(item.is_featured),
      author: {
        name: item.author_name || '관리자',
        email: item.author_email
      },
      createdAt: item.created_at,
      updatedAt: item.updated_at,
      publishedAt: item.published_at
    }));

    return NextResponse.json({
      items: formattedItems,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });

  } catch (error) {
    console.error('Admin posts list error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify admin access
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
      slug,
      categoryId,
      content,
      summary,
      thumbnailUrl,
      isNotice,
      status,
      tags
    } = body;

    // Validate required fields
    if (!title || !categoryId || !content) {
      return NextResponse.json(
        { error: 'Title, category, and content are required' },
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

    // Insert post
    const result = await query(
      `INSERT INTO posts (
        title,
        slug,
        category_id,
        user_id,
        content,
        excerpt,
        featured_image,
        is_notice,
        status,
        published_at,
        created_at,
        updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        title,
        slug || title.toLowerCase().replace(/[^a-z0-9가-힣]+/g, '-').replace(/(^-|-$)/g, ''),
        categoryId,
        admin.id,
        content,
        summary || null,
        thumbnailUrl || null,
        isNotice ? 1 : 0,
        status || 'draft',
        status === 'published' ? new Date() : null
      ]
    );

    const postId = (result as any).insertId;

    // TODO: Implement tags functionality when post_tags table is created
    // if (tags && tags.length > 0) {
    //   const tagValues = tags.map((tag: string) => [postId, tag]);
    //   await query(
    //     `INSERT INTO post_tags (post_id, tag) VALUES ?`,
    //     [tagValues]
    //   );
    // }

    // Log admin action
    await logAdminAction(
      admin.id,
      'CREATE_POST',
      'posts',
      postId,
      { title, categoryId, status, isNotice },
      request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
      request.headers.get('user-agent')
    );

    return NextResponse.json({
      success: true,
      id: postId,
      message: 'Post created successfully'
    });
  } catch (error) {
    console.error('Admin post creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Verify admin access
    const admin = await verifyAdminRequest(request);
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { postIds } = body;

    if (!postIds || !Array.isArray(postIds) || postIds.length === 0) {
      return NextResponse.json(
        { error: 'No posts selected for deletion' },
        { status: 400 }
      );
    }

    // Delete posts
    const placeholders = postIds.map(() => '?').join(',');
    await query(
      `DELETE FROM posts WHERE id IN (${placeholders})`,
      postIds
    );

    // Log admin action
    await logAdminAction(
      admin.id,
      'BULK_DELETE_POSTS',
      'posts',
      null,
      { postIds, count: postIds.length },
      request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
      request.headers.get('user-agent')
    );

    return NextResponse.json({
      success: true,
      message: `${postIds.length} posts deleted successfully`
    });
  } catch (error) {
    console.error('Admin posts bulk delete error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    // Verify admin access
    const admin = await verifyAdminRequest(request);
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { postIds, action, value } = body;

    if (!postIds || !Array.isArray(postIds) || postIds.length === 0) {
      return NextResponse.json(
        { error: 'No posts selected' },
        { status: 400 }
      );
    }

    if (!action) {
      return NextResponse.json(
        { error: 'Action is required' },
        { status: 400 }
      );
    }

    let updateQuery = '';
    let updateParams = [];

    switch (action) {
      case 'UPDATE_STATUS':
        if (!value || !['draft', 'published', 'archived'].includes(value)) {
          return NextResponse.json(
            { error: 'Invalid status value' },
            { status: 400 }
          );
        }
        const placeholders = postIds.map(() => '?').join(',');
        updateQuery = `UPDATE posts SET status = ? WHERE id IN (${placeholders})`;
        updateParams = [value, ...postIds];
        break;

      case 'UPDATE_CATEGORY':
        if (!value) {
          return NextResponse.json(
            { error: 'Category ID is required' },
            { status: 400 }
          );
        }
        const categoryPlaceholders = postIds.map(() => '?').join(',');
        updateQuery = `UPDATE posts SET category_id = ? WHERE id IN (${categoryPlaceholders})`;
        updateParams = [value, ...postIds];
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

    // Execute update
    await query(updateQuery, updateParams);

    // Log admin action
    await logAdminAction(
      admin.id,
      `BULK_${action}`,
      'posts',
      null,
      { postIds, value, count: postIds.length },
      request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
      request.headers.get('user-agent')
    );

    return NextResponse.json({
      success: true,
      message: `${postIds.length} posts updated successfully`
    });
  } catch (error) {
    console.error('Admin posts bulk update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}