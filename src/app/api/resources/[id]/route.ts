import { NextRequest, NextResponse } from 'next/server';
import { getContainer } from '@/infrastructure/config/getContainer';

// GET /api/resources/[id] - Get single resource
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const resourceId = parseInt(id);

    if (isNaN(resourceId)) {
      return NextResponse.json(
        { error: 'Invalid resource ID' },
        { status: 400 }
      );
    }

    const container = getContainer();
    const resourceRepository = container.getResourceRepository();

    // Increment view count
    await resourceRepository.incrementViewCount(resourceId);

    const resource = await resourceRepository.findById(resourceId);

    if (!resource) {
      return NextResponse.json(
        { error: 'Resource not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(resource);
  } catch (error) {
    console.error('Error fetching resource:', error);
    return NextResponse.json(
      { error: 'Failed to fetch resource' },
      { status: 500 }
    );
  }
}

// PUT /api/resources/[id] - Update resource (Admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // TODO: Add authentication check
    const { id } = await params;
    const resourceId = parseInt(id);

    if (isNaN(resourceId)) {
      return NextResponse.json(
        { error: 'Invalid resource ID' },
        { status: 400 }
      );
    }

    const container = getContainer();
    const resourceRepository = container.getResourceRepository();

    const resource = await resourceRepository.findById(resourceId);

    if (!resource) {
      return NextResponse.json(
        { error: 'Resource not found' },
        { status: 404 }
      );
    }

    const body = await request.json();

    resource.update({
      categoryId: body.categoryId,
      title: body.title,
      slug: body.slug,
      description: body.description,
      resourceType: body.resourceType,
      fileType: body.fileType,
      filePath: body.filePath,
      fileSize: body.fileSize,
      originalFilename: body.originalFilename,
      thumbnailPath: body.thumbnailPath,
      externalLink: body.externalLink,
      externalLinkTitle: body.externalLinkTitle,
      isFeatured: body.isFeatured,
      isActive: body.isActive,
      publishedAt: body.publishedAt ? new Date(body.publishedAt) : null
    }, body.updatedBy);

    const updated = await resourceRepository.update(resource);

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating resource:', error);
    return NextResponse.json(
      { error: 'Failed to update resource' },
      { status: 500 }
    );
  }
}

// DELETE /api/resources/[id] - Delete resource (Admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // TODO: Add authentication check
    const { id } = await params;
    const resourceId = parseInt(id);

    if (isNaN(resourceId)) {
      return NextResponse.json(
        { error: 'Invalid resource ID' },
        { status: 400 }
      );
    }

    const container = getContainer();
    const resourceRepository = container.getResourceRepository();

    await resourceRepository.delete(resourceId);

    return NextResponse.json(
      { message: 'Resource deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting resource:', error);
    return NextResponse.json(
      { error: 'Failed to delete resource' },
      { status: 500 }
    );
  }
}