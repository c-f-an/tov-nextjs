import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminRequest, logAdminAction } from '@/lib/auth-admin';
import { query } from '@/infrastructure/database/mysql';

// GET - 개별 배너 조회
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: bannerId } = await params;

    // Admin 권한 확인
    const admin = await verifyAdminRequest(request);
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    // 배너 조회
    const banners = await query(
      `SELECT * FROM main_banners WHERE id = ?`,
      [bannerId]
    );

    if (!banners || (banners as any[]).length === 0) {
      return NextResponse.json(
        { error: 'Banner not found' },
        { status: 404 }
      );
    }

    const banner = (banners as any[])[0];

    return NextResponse.json({
      id: banner.id,
      title: banner.title,
      subtitle: banner.subtitle,
      description: banner.description,
      imagePath: banner.image_path,
      imageOption: banner.image_option,
      linkUrl: banner.link_url,
      linkTarget: banner.link_target,
      sortOrder: banner.sort_order,
      isActive: banner.is_active === 1,
      startDate: banner.start_date,
      endDate: banner.end_date,
      createdAt: banner.created_at,
      updatedAt: banner.updated_at
    });
  } catch (error) {
    console.error('Admin banner fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - 배너 수정
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: bannerId } = await params;

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

    console.log('Received banner update request:', {
      bannerId,
      title,
      linkUrl,
      linkTarget,
      imagePath
    });

    // Validate required fields
    if (!imagePath) {
      return NextResponse.json(
        { error: 'Image path is required' },
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

    // 배너 업데이트
    await query(
      `UPDATE main_banners SET
        title = ?,
        subtitle = ?,
        description = ?,
        image_path = ?,
        image_option = ?,
        link_url = ?,
        link_target = ?,
        sort_order = ?,
        is_active = ?,
        start_date = ?,
        end_date = ?,
        updated_at = NOW()
       WHERE id = ?`,
      [
        title || '',
        subtitle || '',
        description || '',
        imagePath,
        imageOption || '',
        linkUrl || '',
        linkTarget || '_self',
        sortOrder || 0,
        isActive ? 1 : 0,
        startDate || null,
        endDate || null,
        bannerId
      ]
    );

    // Log admin action
    await logAdminAction(
      admin.id,
      'UPDATE_BANNER',
      'main_banners',
      bannerId,
      { title, isActive },
      request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
      request.headers.get('user-agent')
    );

    return NextResponse.json({
      success: true,
      message: 'Banner updated successfully'
    });
  } catch (error) {
    console.error('Admin banner update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - 배너 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: bannerId } = await params;

    // Admin 권한 확인
    const admin = await verifyAdminRequest(request);
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    // 배너 정보 가져오기 (로깅용)
    const banners = await query(
      `SELECT title FROM main_banners WHERE id = ?`,
      [bannerId]
    );

    if (!banners || (banners as any[]).length === 0) {
      return NextResponse.json(
        { error: 'Banner not found' },
        { status: 404 }
      );
    }

    const bannerTitle = (banners as any[])[0].title;

    // 배너 삭제
    await query(`DELETE FROM main_banners WHERE id = ?`, [bannerId]);

    // Log admin action
    await logAdminAction(
      admin.id,
      'DELETE_BANNER',
      'main_banners',
      bannerId,
      { title: bannerTitle },
      request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
      request.headers.get('user-agent')
    );

    return NextResponse.json({
      success: true,
      message: 'Banner deleted successfully'
    });
  } catch (error) {
    console.error('Admin banner delete error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
