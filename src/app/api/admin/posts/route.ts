import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminRequest, logAdminAction } from '@/lib/auth-admin';
import { query } from '@/infrastructure/database/mysql';

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
        title.toLowerCase().replace(/[^a-z0-9가-힣]+/g, '-').replace(/(^-|-$)/g, ''),
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