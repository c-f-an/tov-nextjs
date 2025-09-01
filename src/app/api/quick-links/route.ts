import { NextRequest, NextResponse } from 'next/server';
import { getContainer } from '@/infrastructure/config/getContainer';
import { QuickLink } from '@/core/domain/entities/QuickLink';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeInactive = searchParams.get('includeInactive') === 'true';

    const container = getContainer();
    const quickLinkRepository = container.getQuickLinkRepository();
    const quickLinks = await quickLinkRepository.findAll(!includeInactive);

    return NextResponse.json({
      quickLinks: quickLinks.map(quickLink => ({
        id: quickLink.id,
        title: quickLink.title,
        icon: quickLink.icon,
        linkUrl: quickLink.linkUrl,
        description: quickLink.description,
        sortOrder: quickLink.sortOrder,
        isActive: quickLink.isActive,
        isExternal: quickLink.isExternal()
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
    // Check authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const authService = container.getAuthService();
    const payload = await authService.verifyAccessToken(token);

    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const body = await request.json();
    
    if (!body.title || !body.linkUrl) {
      return NextResponse.json(
        { error: 'Title and linkUrl are required' },
        { status: 400 }
      );
    }

    const quickLinkRepository = container.getQuickLinkRepository();
    
    const newQuickLink = QuickLink.create({
      title: body.title,
      icon: body.icon,
      linkUrl: body.linkUrl,
      description: body.description,
      sortOrder: body.sortOrder || 0,
      isActive: body.isActive !== undefined ? body.isActive : true
    });

    const savedQuickLink = await quickLinkRepository.save(newQuickLink);

    return NextResponse.json({
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
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating quick link:', error);
    return NextResponse.json(
      { error: 'Failed to create quick link' },
      { status: 500 }
    );
  }
}