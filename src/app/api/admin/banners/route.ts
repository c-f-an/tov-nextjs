import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminRequest, logAdminAction } from '@/lib/auth-admin';
import { query } from '@/infrastructure/database/mysql';

// GET - 배너 목록 조회
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

    // 배너 목록 조회
    const banners = await query(
      `SELECT * FROM main_banners ORDER BY sort_order ASC, created_at DESC`
    );

    return NextResponse.json(banners);
  } catch (error) {
    console.error('Admin banners fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - 배너 생성
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
      subtitle,
      description,
      imagePath,
      imageOption,
      linkUrl,
      linkTarget,
      sortOrder,
      isActive,
      startDate,
      endDate
    } = body;

    // Validate required fields
    if (!title || !imagePath) {
      return NextResponse.json(
        { error: 'Title and image path are required' },
        { status: 400 }
      );
    }

    // Validate image path (block base64 data)
    if (imagePath && imagePath.startsWith('data:')) {
      return NextResponse.json(
        { error: '이미지는 URL 형식이어야 합니다. 이미지를 S3에 업로드하거나 외부 URL을 사용하세요.' },
        { status: 400 }
      );
    }

    // Insert banner
    const result = await query(
      `INSERT INTO main_banners (
        title,
        subtitle,
        description,
        image_path,
        image_option,
        link_url,
        link_target,
        sort_order,
        is_active,
        start_date,
        end_date,
        created_at,
        updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        title,
        subtitle || null,
        description || null,
        imagePath,
        imageOption || null,
        linkUrl || null,
        linkTarget || '_self',
        sortOrder || 0,
        isActive ? 1 : 0,
        startDate || null,
        endDate || null
      ]
    );

    const bannerId = (result as any).insertId;

    // Log admin action
    await logAdminAction(
      admin.id,
      'CREATE_BANNER',
      'main_banners',
      bannerId,
      { title, isActive },
      request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
      request.headers.get('user-agent')
    );

    return NextResponse.json({
      success: true,
      id: bannerId,
      message: 'Banner created successfully'
    });
  } catch (error) {
    console.error('Admin banner creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - 배너 일괄 삭제
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
    const { bannerIds } = body;

    if (!bannerIds || !Array.isArray(bannerIds) || bannerIds.length === 0) {
      return NextResponse.json(
        { error: 'No banners selected for deletion' },
        { status: 400 }
      );
    }

    // Delete banners
    const placeholders = bannerIds.map(() => '?').join(',');
    await query(
      `DELETE FROM main_banners WHERE id IN (${placeholders})`,
      bannerIds
    );

    // Log admin action
    await logAdminAction(
      admin.id,
      'BULK_DELETE_BANNERS',
      'main_banners',
      null,
      { bannerIds, count: bannerIds.length },
      request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
      request.headers.get('user-agent')
    );

    return NextResponse.json({
      success: true,
      message: `${bannerIds.length} banners deleted successfully`
    });
  } catch (error) {
    console.error('Admin banners bulk delete error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
