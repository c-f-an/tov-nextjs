import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/infrastructure/database/mysql';

// 섬기는 사람들 타입 정의
interface OrganizationPerson {
  id: number;
  name: string;
  category: string;
  description: string | null;
  photoUrl: string | null;
  position: string | null;
  email: string | null;
  phone: string | null;
  sortOrder: number;
  isActive: boolean;
}

// GET /api/organization-people - 섬기는 사람들 목록 조회
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const activeOnly = searchParams.get('activeOnly') !== 'false'; // 기본값 true

    const subQueryConditions: string[] = [];
    const mainQueryConditions: string[] = [];
    const queryParams: any[] = [];

    // 활성화된 항목만 조회 (기본)
    if (activeOnly) {
      subQueryConditions.push('is_active = ?');
      mainQueryConditions.push('p.is_active = ?');
      queryParams.push(1);
    }

    // 카테고리 필터
    if (category) {
      subQueryConditions.push('category = ?');
      mainQueryConditions.push('p.category = ?');
      queryParams.push(category);
    }

    const subWhereClause = subQueryConditions.length > 0
      ? `WHERE ${subQueryConditions.join(' AND ')}`
      : '';

    const mainWhereClause = mainQueryConditions.length > 0
      ? `WHERE ${mainQueryConditions.join(' AND ')}`
      : '';

    // 카테고리별 최소 sort_order를 기준으로 정렬
    const dataQuery = `
      SELECT
        p.id,
        p.name,
        p.category,
        p.description,
        p.photo_url,
        p.position,
        p.email,
        p.phone,
        p.sort_order,
        p.is_active,
        cat_order.min_sort
      FROM organization_people p
      LEFT JOIN (
        SELECT category, MIN(sort_order) as min_sort
        FROM organization_people
        ${subWhereClause}
        GROUP BY category
      ) cat_order ON p.category = cat_order.category
      ${mainWhereClause}
      ORDER BY cat_order.min_sort ASC, p.sort_order ASC
    `;

    // 서브쿼리와 메인쿼리 모두에 파라미터 전달
    const rows = await query(dataQuery, [...queryParams, ...queryParams]) as any[];

    // 카멜케이스로 변환
    const items: OrganizationPerson[] = rows.map(row => ({
      id: row.id,
      name: row.name,
      category: row.category,
      description: row.description,
      photoUrl: row.photo_url,
      position: row.position,
      email: row.email,
      phone: row.phone,
      sortOrder: row.sort_order,
      isActive: Boolean(row.is_active)
    }));

    // 카테고리별로 그룹핑 (순서 유지)
    const grouped: Record<string, OrganizationPerson[]> = {};
    const categoryOrder: string[] = [];

    items.forEach(item => {
      if (!grouped[item.category]) {
        grouped[item.category] = [];
        categoryOrder.push(item.category);
      }
      grouped[item.category].push(item);
    });

    return NextResponse.json({
      items,
      grouped,
      categoryOrder,
      total: items.length
    });

  } catch (error) {
    console.error('Error getting organization people:', error);
    return NextResponse.json(
      { error: '섬기는 사람들 목록을 불러오는데 실패했습니다.' },
      { status: 500 }
    );
  }
}
