import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminRequest, logAdminAction } from '@/lib/auth-admin';
import { MySQLQuickLinkRepository } from '@/infrastructure/repositories/MySQLQuickLinkRepository';
import { QuickLink } from '@/core/domain/entities/QuickLink';

const quickLinkRepository = new MySQLQuickLinkRepository();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await verifyAdminRequest(request);
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    const quickLink = await quickLinkRepository.findById(parseInt(params.id));

    if (!quickLink) {
      return NextResponse.json(
        { error: 'Quick link not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      quickLink: {
        id: quickLink.id,
        title: quickLink.title,
        icon: quickLink.icon,
        linkUrl: quickLink.linkUrl,
        description: quickLink.description,
        sortOrder: quickLink.sortOrder,
        isActive: quickLink.isActive,
        createdAt: quickLink.createdAt,
        updatedAt: quickLink.updatedAt
      }
    });
  } catch (error) {
    console.error('Error fetching quick link:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quick link' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await verifyAdminRequest(request);
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { title, icon, linkUrl, description, sortOrder, isActive } = body;

    if (!title || !linkUrl) {
      return NextResponse.json(
        { error: 'Title and link URL are required' },
        { status: 400 }
      );
    }

    const existingQuickLink = await quickLinkRepository.findById(parseInt(params.id));

    if (!existingQuickLink) {
      return NextResponse.json(
        { error: 'Quick link not found' },
        { status: 404 }
      );
    }

    const updatedQuickLink = new QuickLink(
      parseInt(params.id),
      title,
      icon || null,
      linkUrl,
      description || null,
      sortOrder !== undefined ? sortOrder : existingQuickLink.sortOrder,
      isActive !== undefined ? isActive : existingQuickLink.isActive,
      existingQuickLink.createdAt,
      new Date()
    );

    await quickLinkRepository.update(updatedQuickLink);

    // Log admin action
    await logAdminAction(
      admin.id,
      'UPDATE_QUICK_LINK',
      'quick_links',
      parseInt(params.id),
      { title, linkUrl, isActive },
      request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
      request.headers.get('user-agent')
    );

    return NextResponse.json({
      message: 'Quick link updated successfully',
      quickLink: {
        id: updatedQuickLink.id,
        title: updatedQuickLink.title,
        icon: updatedQuickLink.icon,
        linkUrl: updatedQuickLink.linkUrl,
        description: updatedQuickLink.description,
        sortOrder: updatedQuickLink.sortOrder,
        isActive: updatedQuickLink.isActive,
        createdAt: updatedQuickLink.createdAt,
        updatedAt: updatedQuickLink.updatedAt
      }
    });
  } catch (error) {
    console.error('Error updating quick link:', error);
    return NextResponse.json(
      { error: 'Failed to update quick link' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await verifyAdminRequest(request);
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    const existingQuickLink = await quickLinkRepository.findById(parseInt(params.id));

    if (!existingQuickLink) {
      return NextResponse.json(
        { error: 'Quick link not found' },
        { status: 404 }
      );
    }

    await quickLinkRepository.delete(parseInt(params.id));

    // Log admin action
    await logAdminAction(
      admin.id,
      'DELETE_QUICK_LINK',
      'quick_links',
      parseInt(params.id),
      { title: existingQuickLink.title },
      request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
      request.headers.get('user-agent')
    );

    return NextResponse.json({
      message: 'Quick link deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting quick link:', error);
    return NextResponse.json(
      { error: 'Failed to delete quick link' },
      { status: 500 }
    );
  }
}
