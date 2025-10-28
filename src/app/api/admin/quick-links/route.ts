import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminRequest, logAdminAction } from '@/lib/auth-admin';
import { MySQLQuickLinkRepository } from '@/infrastructure/repositories/MySQLQuickLinkRepository';
import { QuickLink } from '@/core/domain/entities/QuickLink';

const quickLinkRepository = new MySQLQuickLinkRepository();

export async function GET(request: NextRequest) {
  try {
    const admin = await verifyAdminRequest(request);
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    const quickLinks = await quickLinkRepository.findAll(false);

    return NextResponse.json({
      quickLinks: quickLinks.map(link => ({
        id: link.id,
        title: link.title,
        icon: link.icon,
        linkUrl: link.linkUrl,
        description: link.description,
        sortOrder: link.sortOrder,
        isActive: link.isActive,
        createdAt: link.createdAt,
        updatedAt: link.updatedAt
      }))
    });
  } catch (error) {
    console.error('Error fetching quick links:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quick links' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
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

    const quickLink = new QuickLink(
      0,
      title,
      icon || null,
      linkUrl,
      description || null,
      sortOrder || 0,
      isActive !== undefined ? isActive : true,
      new Date(),
      new Date()
    );

    const savedQuickLink = await quickLinkRepository.save(quickLink);

    // Log admin action
    await logAdminAction(
      admin.id,
      'CREATE_QUICK_LINK',
      'quick_links',
      savedQuickLink.id,
      { title, linkUrl },
      request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
      request.headers.get('user-agent')
    );

    return NextResponse.json({
      message: 'Quick link created successfully',
      quickLink: {
        id: savedQuickLink.id,
        title: savedQuickLink.title,
        icon: savedQuickLink.icon,
        linkUrl: savedQuickLink.linkUrl,
        description: savedQuickLink.description,
        sortOrder: savedQuickLink.sortOrder,
        isActive: savedQuickLink.isActive,
        createdAt: savedQuickLink.createdAt,
        updatedAt: savedQuickLink.updatedAt
      }
    });
  } catch (error) {
    console.error('Error creating quick link:', error);
    return NextResponse.json(
      { error: 'Failed to create quick link' },
      { status: 500 }
    );
  }
}
