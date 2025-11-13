import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/infrastructure/database/mysql';

// 카테고리 타입 매핑
const CATEGORY_TYPE_MAP: Record<string, string> = {
  'notice': 'notice',
  'activity': 'activity',
  'media': 'media',
  'publication': 'publication',
  'resource': 'resource',
  'news': 'news',
  'laws': 'laws'
};

// GET /api/posts - posts 테이블에서 게시물 목록 조회
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const category = searchParams.get('category');
    const categoryId = searchParams.get('categoryId');
    const searchTerm = searchParams.get('search');
    const sortBy = searchParams.get('sort') || 'latest';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const publishedParam = searchParams.get('published');

    // 기본 쿼리
    let whereConditions = ['p.status = ?'];
    let queryParams: any[] = ['published'];

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

    // 공개 여부 필터 (관리자용)
    if (publishedParam === 'false') {
      queryParams[0] = 'draft'; // status를 draft로 변경
    }

    // 전체 개수 조회
    const countQuery = `
      SELECT COUNT(*) as total
      FROM posts p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE ${whereConditions.join(' AND ')}
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
      WHERE ${whereConditions.join(' AND ')}
      ORDER BY ${orderBy}
      LIMIT ? OFFSET ?
    `;

    queryParams.push(limit, offset);
    const items = await query(dataQuery, queryParams) as any[];

    // 응답 형식 맞추기 (기존 news API와 호환)
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
    console.error('Error getting news list:', error);
    return NextResponse.json(
      { error: '뉴스 목록을 불러오는데 실패했습니다.' },
      { status: 500 }
    );
  }
}

// POST /api/posts - 게시물 생성 (posts 테이블에 저장)
export async function POST(request: NextRequest) {
  try {
    // TODO: 관리자 권한 체크
    const body = await request.json();
    const {
      title,
      category,
      content,
      summary,
      thumbnail,
      isPublished = true,
      isNotice = false,
      isFeatured = false
    } = body;

    // 카테고리 조회
    const [categoryData] = await query(
      'SELECT id FROM categories WHERE type = ? LIMIT 1',
      [CATEGORY_TYPE_MAP[category] || category]
    ) as any[];

    if (!categoryData) {
      return NextResponse.json(
        { error: '유효하지 않은 카테고리입니다.' },
        { status: 400 }
      );
    }

    // posts 테이블에 삽입
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
        is_featured,
        status,
        published_at,
        created_at,
        updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        title,
        title.toLowerCase().replace(/[^a-z0-9가-힣]+/g, '-').replace(/(^-|-$)/g, ''),
        categoryData.id,
        1, // TODO: 실제 사용자 ID 사용
        content,
        summary || null,
        thumbnail || null,
        isNotice ? 1 : 0,
        isFeatured ? 1 : 0,
        isPublished ? 'published' : 'draft',
        isPublished ? new Date() : null
      ]
    );

    const newsId = (result as any).insertId;

    // 생성된 뉴스 조회
    const [created] = await query(
      `SELECT
        p.*,
        c.name as category_name,
        c.slug as category_slug,
        c.type as category
      FROM posts p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = ?`,
      [newsId]
    ) as any[];

    return NextResponse.json({
      id: created.id,
      title: created.title,
      slug: created.slug,
      summary: created.excerpt,
      content: created.content,
      thumbnail: created.featured_image,
      category: created.category,
      categoryName: created.category_name,
      categorySlug: created.category_slug,
      views: 0,
      isPublished: created.status === 'published',
      isNotice: Boolean(created.is_notice),
      isFeatured: Boolean(created.is_featured),
      createdAt: created.created_at,
      updatedAt: created.updated_at,
      publishedAt: created.published_at
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating news:', error);
    return NextResponse.json(
      { error: '뉴스 생성에 실패했습니다.' },
      { status: 500 }
    );
  }
}