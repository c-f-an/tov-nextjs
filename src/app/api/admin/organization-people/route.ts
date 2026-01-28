import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/infrastructure/database/mysql';
import { verifyAdminRequest, logAdminAction } from '@/lib/auth-admin';

// GET /api/admin/organization-people - 섬기는 사람들 목록 조회 (관리자)
export async function GET(request: NextRequest) {
  try {
    const admin = await verifyAdminRequest(request);
    if (!admin) {
      return NextResponse.json({ error: '관리자 권한이 필요합니다.' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const activeOnly = searchParams.get('activeOnly') === 'true';

    const conditions: string[] = [];
    const params: any[] = [];

    if (activeOnly) {
      conditions.push('is_active = ?');
      params.push(1);
    }

    if (category) {
      conditions.push('category = ?');
      params.push(category);
    }

    if (search) {
      conditions.push('(name LIKE ? OR position LIKE ?)');
      params.push(`%${search}%`, `%${search}%`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const dataQuery = `
      SELECT
        id,
        name,
        category,
        description,
        photo_url,
        position,
        email,
        phone,
        sort_order,
        is_active,
        created_at,
        updated_at
      FROM organization_people
      ${whereClause}
      ORDER BY sort_order ASC, id ASC
    `;

    const rows = await query(dataQuery, params) as any[];

    // 카테고리 목록 조회
    const categoryRows = await query(
      'SELECT category, MIN(sort_order) as min_sort FROM organization_people GROUP BY category ORDER BY min_sort ASC',
      []
    ) as any[];
    const categories = categoryRows.map(row => row.category);

    return NextResponse.json({
      items: rows.map(row => ({
        id: row.id,
        name: row.name,
        category: row.category,
        description: row.description,
        photoUrl: row.photo_url,
        position: row.position,
        email: row.email,
        phone: row.phone,
        sortOrder: row.sort_order,
        isActive: Boolean(row.is_active),
        createdAt: row.created_at,
        updatedAt: row.updated_at
      })),
      categories,
      total: rows.length
    });

  } catch (error) {
    console.error('Error getting organization people:', error);
    return NextResponse.json(
      { error: '섬기는 사람들 목록을 불러오는데 실패했습니다.' },
      { status: 500 }
    );
  }
}

// POST /api/admin/organization-people - 섬기는 사람 생성
export async function POST(request: NextRequest) {
  try {
    const admin = await verifyAdminRequest(request);
    if (!admin) {
      return NextResponse.json({ error: '관리자 권한이 필요합니다.' }, { status: 401 });
    }

    const body = await request.json();
    const { name, category, description, photoUrl, position, email, phone, sortOrder, isActive } = body;

    if (!name || !category) {
      return NextResponse.json({ error: '이름과 카테고리는 필수입니다.' }, { status: 400 });
    }

    const result = await query(
      `INSERT INTO organization_people
        (name, category, description, photo_url, position, email, phone, sort_order, is_active, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        name,
        category,
        description || null,
        photoUrl || null,
        position || null,
        email || null,
        phone || null,
        sortOrder || 0,
        isActive !== false ? 1 : 0
      ]
    ) as any;

    await logAdminAction(admin.id, 'CREATE', 'organization_people', result.insertId, { name, category });

    return NextResponse.json({ id: result.insertId, message: '등록되었습니다.' }, { status: 201 });

  } catch (error) {
    console.error('Error creating organization person:', error);
    return NextResponse.json({ error: '등록에 실패했습니다.' }, { status: 500 });
  }
}

// DELETE /api/admin/organization-people - 일괄 삭제
export async function DELETE(request: NextRequest) {
  try {
    const admin = await verifyAdminRequest(request);
    if (!admin) {
      return NextResponse.json({ error: '관리자 권한이 필요합니다.' }, { status: 401 });
    }

    const body = await request.json();
    const { ids } = body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: '삭제할 항목을 선택해주세요.' }, { status: 400 });
    }

    const placeholders = ids.map(() => '?').join(',');
    await query(`DELETE FROM organization_people WHERE id IN (${placeholders})`, ids);

    await logAdminAction(admin.id, 'BULK_DELETE', 'organization_people', undefined, { ids });

    return NextResponse.json({ message: `${ids.length}건이 삭제되었습니다.` });

  } catch (error) {
    console.error('Error deleting organization people:', error);
    return NextResponse.json({ error: '삭제에 실패했습니다.' }, { status: 500 });
  }
}
