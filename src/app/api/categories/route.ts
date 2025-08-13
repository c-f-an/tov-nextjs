import { NextRequest, NextResponse } from 'next/server';
import { container } from '@/infrastructure/config/container.tsyringe';
import { GetCategoriesUseCase } from '@/core/application/use-cases/category/GetCategoriesUseCase';
import { CreateCategoryUseCase } from '@/core/application/use-cases/category/CreateCategoryUseCase';
import { withAuth } from '@/presentation/middleware/authMiddleware';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const includeInactive = searchParams.get('includeInactive') === 'true';
    const withHierarchy = searchParams.get('withHierarchy') === 'true';
    const slug = searchParams.get('slug');

    const getCategoriesUseCase = container.resolve(GetCategoriesUseCase);
    
    let categories = withHierarchy
      ? await getCategoriesUseCase.executeWithHierarchy(includeInactive)
      : await getCategoriesUseCase.execute(includeInactive);

    // Filter by slug if provided
    if (slug) {
      categories = categories.filter(cat => cat.slug === slug);
    }

    return NextResponse.json(categories);
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
    const createCategoryUseCase = container.resolve(CreateCategoryUseCase);
    
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