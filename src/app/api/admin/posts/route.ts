import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminRequest, logAdminAction } from '@/lib/auth-admin';
import { query } from '@/infrastructure/database/mysql';

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