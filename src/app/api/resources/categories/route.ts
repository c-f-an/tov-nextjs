import { NextRequest, NextResponse } from 'next/server';
import { getContainer } from '@/infrastructure/config/getContainer';

// GET /api/resources/categories - Get all resource categories
export async function GET(request: NextRequest) {
  try {
    const container = getContainer();
    const resourceCategoryRepository = container.getResourceCategoryRepository();

    const searchParams = request.nextUrl.searchParams;
    const active = searchParams.get('active');

    const categories = active === 'true'
      ? await resourceCategoryRepository.findActive()
      : await resourceCategoryRepository.findAll();

    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching resource categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch resource categories' },
      { status: 500 }
    );
  }
}

// POST /api/resources/categories - Create a new category (Admin only)
export async function POST(request: NextRequest) {
  try {
    // TODO: Add authentication check
    const container = getContainer();
    const resourceCategoryRepository = container.getResourceCategoryRepository();

    const body = await request.json();
    const { ResourceCategory } = await import('@/core/domain/entities/ResourceCategory');

    const category = ResourceCategory.create(
      body.name,
      body.slug,
      body.description,
      body.icon,
      body.sortOrder || 0,
      body.isActive !== false
    );

    const created = await resourceCategoryRepository.create(category);

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error('Error creating resource category:', error);
    return NextResponse.json(
      { error: 'Failed to create resource category' },
      { status: 500 }
    );
  }
}