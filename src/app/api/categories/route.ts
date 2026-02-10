import { NextRequest, NextResponse } from 'next/server';
import { getContainer } from '@/infrastructure/config/getContainer';
import { withAuth } from '@/presentation/middleware/authMiddleware';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const includeInactive = searchParams.get('includeInactive') === 'true';
    const withHierarchy = searchParams.get('withHierarchy') === 'true';
    const slug = searchParams.get('slug');

    const container = getContainer();
    const getCategoriesUseCase = container.getGetCategoriesUseCase();
    
    let categories = withHierarchy
      ? await getCategoriesUseCase.executeWithHierarchy(includeInactive)
      : await getCategoriesUseCase.execute(includeInactive);

    // Filter by slug if provided
    if (slug) {
      categories = categories.filter(cat => cat.slug === slug);
    }

    return NextResponse.json(categories, {
      headers: {
        'Cache-Control': 'public, max-age=300, stale-while-revalidate=60', // 5 minutes cache
      },
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await withAuth(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const container = getContainer();
    const createCategoryUseCase = container.getCreateCategoryUseCase();
    
    const category = await createCategoryUseCase.execute(body);

    return NextResponse.json(category, { status: 201 });
  } catch (error: any) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create category' },
      { status: 400 }
    );
  }
}