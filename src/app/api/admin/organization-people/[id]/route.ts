import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/infrastructure/database/mysql';
import { verifyAdminRequest, logAdminAction } from '@/lib/auth-admin';

// GET /api/admin/organization-people/[id] - 개별 조회
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await verifyAdminRequest(request);
    if (!admin) {
      return NextResponse.json({ error: '관리자 권한이 필요합니다.' }, { status: 401 });
    }

    const { id } = await params;

    const rows = await query(
      `SELECT * FROM organization_people WHERE id = ?`,
      [parseInt(id)]
    ) as any[];

    if (rows.length === 0) {
      return NextResponse.json({ error: '존재하지 않는 항목입니다.' }, { status: 404 });
    }

    const row = rows[0];
    return NextResponse.json({
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
    });

  } catch (error) {
    console.error('Error getting organization person:', error);
    return NextResponse.json({ error: '조회에 실패했습니다.' }, { status: 500 });
  }
}

// PUT /api/admin/organization-people/[id] - 수정
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await verifyAdminRequest(request);
    if (!admin) {
      return NextResponse.json({ error: '관리자 권한이 필요합니다.' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { name, category, description, photoUrl, position, email, phone, sortOrder, isActive } = body;

    if (!name || !category) {
      return NextResponse.json({ error: '이름과 카테고리는 필수입니다.' }, { status: 400 });
    }

    await query(
      `UPDATE organization_people SET
        name = ?,
        category = ?,
        description = ?,
        photo_url = ?,
        position = ?,
        email = ?,
        phone = ?,
        sort_order = ?,
        is_active = ?,
        updated_at = NOW()
       WHERE id = ?`,
      [
        name,
        category,
        description || null,
        photoUrl || null,
        position || null,
        email || null,
        phone || null,
        sortOrder || 0,
        isActive !== false ? 1 : 0,
        parseInt(id)
      ]
    );

    await logAdminAction(admin.id, 'UPDATE', 'organization_people', parseInt(id), { name, category });

    return NextResponse.json({ message: '수정되었습니다.' });

  } catch (error) {
    console.error('Error updating organization person:', error);
    return NextResponse.json({ error: '수정에 실패했습니다.' }, { status: 500 });
  }
}

// DELETE /api/admin/organization-people/[id] - 개별 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await verifyAdminRequest(request);
    if (!admin) {
      return NextResponse.json({ error: '관리자 권한이 필요합니다.' }, { status: 401 });
    }

    const { id } = await params;

    await query(`DELETE FROM organization_people WHERE id = ?`, [parseInt(id)]);

    await logAdminAction(admin.id, 'DELETE', 'organization_people', parseInt(id));

    return NextResponse.json({ message: '삭제되었습니다.' });

  } catch (error) {
    console.error('Error deleting organization person:', error);
    return NextResponse.json({ error: '삭제에 실패했습니다.' }, { status: 500 });
  }
}
