import { NextRequest, NextResponse } from 'next/server';
import { getContainer } from '@/infrastructure/config/getContainer';

// GET /api/resources/types - Get all resource types
export async function GET() {
  try {
    const container = getContainer();
    const resourceTypeRepository = container.getResourceTypeRepository();

    const types = await resourceTypeRepository.findAll();

    return NextResponse.json(types, {
      headers: {
        'Cache-Control': 'public, max-age=300, stale-while-revalidate=60'
      }
    });
  } catch (error) {
    console.error('Error fetching resource types:', error);
    return NextResponse.json(
      { error: 'Failed to fetch resource types' },
      { status: 500 }
    );
  }
}

// POST /api/resources/types - Create a new resource type (Admin only)
export async function POST(request: NextRequest) {
  try {
    const container = getContainer();
    const resourceTypeRepository = container.getResourceTypeRepository();

    const body = await request.json();
    const { ResourceType } = await import('@/core/domain/entities/ResourceType');

    const type = ResourceType.create(
      body.name,
      body.code,
      body.sortOrder || 0
    );

    const created = await resourceTypeRepository.create(type);

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error('Error creating resource type:', error);
    return NextResponse.json(
      { error: 'Failed to create resource type' },
      { status: 500 }
    );
  }
}
