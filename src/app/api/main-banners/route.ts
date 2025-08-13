import { NextRequest, NextResponse } from 'next/server';
import { container } from '@/infrastructure/config/container.tsyringe';
import { IMainBannerRepository } from '@/core/domain/repositories/IMainBannerRepository';
import { MainBanner } from '@/core/domain/entities/MainBanner';
import { IAuthService } from '@/core/domain/services/IAuthService';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeInactive = searchParams.get('includeInactive') === 'true';
    const activeOnly = searchParams.get('activeOnly') === 'true';

    const bannerRepository = container.resolve<IMainBannerRepository>('IMainBannerRepository');

    let banners;
    if (activeOnly) {
      banners = await bannerRepository.findActive();
    } else {
      banners = await bannerRepository.findAll(!includeInactive);
    }

    return NextResponse.json({
      banners: banners.map(banner => ({
        id: banner.id,
        title: banner.title,
        subtitle: banner.subtitle,
        description: banner.description,
        imagePath: banner.imagePath,
        linkUrl: banner.linkUrl,
        linkTarget: banner.linkTarget,
        sortOrder: banner.sortOrder,
        isActive: banner.isActive,
        startDate: banner.startDate,
        endDate: banner.endDate,
        isCurrentlyActive: banner.isCurrentlyActive()
      }))
    });
  } catch (error) {
    console.error('Error fetching main banners:', error);
    return NextResponse.json(
      { error: 'Failed to fetch main banners' },
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
    const authService = container.resolve<IAuthService>('IAuthService');
    const payload = await authService.verifyAccessToken(token);

    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const body = await request.json();
    
    if (!body.title || !body.imagePath) {
      return NextResponse.json(
        { error: 'Title and imagePath are required' },
        { status: 400 }
      );
    }

    const bannerRepository = container.resolve<IMainBannerRepository>('IMainBannerRepository');
    
    const newBanner = MainBanner.create({
      title: body.title,
      subtitle: body.subtitle,
      description: body.description,
      imagePath: body.imagePath,
      linkUrl: body.linkUrl,
      linkTarget: body.linkTarget,
      sortOrder: body.sortOrder || 0,
      isActive: body.isActive !== undefined ? body.isActive : true,
      startDate: body.startDate ? new Date(body.startDate) : null,
      endDate: body.endDate ? new Date(body.endDate) : null
    });

    const savedBanner = await bannerRepository.save(newBanner);

    return NextResponse.json({
      banner: {
        id: savedBanner.id,
        title: savedBanner.title,
        subtitle: savedBanner.subtitle,
        description: savedBanner.description,
        imagePath: savedBanner.imagePath,
        linkUrl: savedBanner.linkUrl,
        linkTarget: savedBanner.linkTarget,
        sortOrder: savedBanner.sortOrder,
        isActive: savedBanner.isActive,
        startDate: savedBanner.startDate,
        endDate: savedBanner.endDate,
        createdAt: savedBanner.createdAt,
        updatedAt: savedBanner.updatedAt
      }
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating main banner:', error);
    return NextResponse.json(
      { error: 'Failed to create main banner' },
      { status: 500 }
    );
  }
}