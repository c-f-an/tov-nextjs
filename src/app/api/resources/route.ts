import { NextRequest, NextResponse } from 'next/server';
import { getContainer } from '@/infrastructure/config/getContainer';

// GET /api/resources - Get all resources with pagination
export async function GET(request: NextRequest) {
  try {
    const container = getContainer();
    const resourceRepository = container.getResourceRepository();

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const categoryId = searchParams.get('categoryId');
    const resourceType = searchParams.get('type');
    const isFeatured = searchParams.get('featured');
    const searchTerm = searchParams.get('search');

    const filter = {
      ...(categoryId && { categoryId: parseInt(categoryId) }),
      ...(resourceType && { resourceType }),
      ...(isFeatured !== null && { isFeatured: isFeatured === 'true' }),
      isActive: true,
      ...(searchTerm && { searchTerm })
    };

    const result = await resourceRepository.findAll(filter, {
      page,
      limit,
      orderBy: 'published_at',
      orderDirection: 'DESC'
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching resources:', error);
    return NextResponse.json(
      { error: 'Failed to fetch resources' },
      { status: 500 }
    );
  }
}

// POST /api/resources - Create a new resource (Admin only)
export async function POST(request: NextRequest) {
  try {
    // TODO: Add authentication check
    const container = getContainer();
    const resourceRepository = container.getResourceRepository();

    const body = await request.json();
    const { Resource } = await import('@/core/domain/entities/Resource');

    const resource = Resource.create(
      body.categoryId,
      body.title,
      body.resourceType || 'etc',
      body.description,
      body.createdBy
    );

    // Set additional properties
    if (body.filePath) {
      resource.setFile(
        body.filePath,
        body.originalFilename,
        body.fileType,
        body.fileSize
      );
    }

    if (body.externalLink) {
      resource.externalLink = body.externalLink;
    }

    if (body.isFeatured) {
      resource.isFeatured = body.isFeatured;
    }

    if (body.publishedAt) {
      resource.publishedAt = new Date(body.publishedAt);
    }

    const created = await resourceRepository.create(resource);

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error('Error creating resource:', error);
    return NextResponse.json(
      { error: 'Failed to create resource' },
      { status: 500 }
    );
  }
}