import { MainBanner, LinkTarget } from '@/core/domain/entities/MainBanner';
import { IMainBannerRepository } from '@/core/domain/repositories/IMainBannerRepository';
import { prisma } from '../database/prisma';
import { MainBanner as PrismaMainBanner, LinkTarget as PrismaLinkTarget } from '@prisma/client';

export class PrismaMainBannerRepository implements IMainBannerRepository {
  private toDomain(prismaBanner: PrismaMainBanner): MainBanner {
    return new MainBanner(
      prismaBanner.id,
      prismaBanner.title,
      prismaBanner.subtitle,
      prismaBanner.description,
      prismaBanner.image_path,
      prismaBanner.link_url,
      prismaBanner.link_target as LinkTarget,
      prismaBanner.sort_order,
      prismaBanner.is_active,
      prismaBanner.start_date,
      prismaBanner.end_date,
      prismaBanner.created_at || new Date(),
      prismaBanner.updated_at || new Date()
    );
  }

  async findById(id: number): Promise<MainBanner | null> {
    const banner = await prisma.mainBanner.findUnique({
      where: { id }
    });

    return banner ? this.toDomain(banner) : null;
  }

  async findAll(onlyActive: boolean = true): Promise<MainBanner[]> {
    const banners = await prisma.mainBanner.findMany({
      where: onlyActive ? { is_active: true } : undefined,
      orderBy: [
        { sort_order: 'asc' },
        { created_at: 'desc' }
      ]
    });

    return banners.map(banner => this.toDomain(banner));
  }

  async findActive(): Promise<MainBanner[]> {
    const now = new Date();
    
    const banners = await prisma.mainBanner.findMany({
      where: {
        is_active: true,
        OR: [
          { start_date: null, end_date: null },
          { start_date: { lte: now }, end_date: null },
          { start_date: null, end_date: { gte: now } },
          { start_date: { lte: now }, end_date: { gte: now } }
        ]
      },
      orderBy: [
        { sort_order: 'asc' },
        { created_at: 'desc' }
      ]
    });

    return banners.map(banner => this.toDomain(banner));
  }

  async save(banner: MainBanner): Promise<MainBanner> {
    const savedBanner = await prisma.mainBanner.create({
      data: {
        title: banner.title,
        subtitle: banner.subtitle,
        description: banner.description,
        image_path: banner.imagePath,
        link_url: banner.linkUrl,
        link_target: banner.linkTarget as PrismaLinkTarget,
        sort_order: banner.sortOrder,
        is_active: banner.isActive,
        start_date: banner.startDate,
        end_date: banner.endDate
      }
    });

    return this.toDomain(savedBanner);
  }

  async update(banner: MainBanner): Promise<void> {
    await prisma.mainBanner.update({
      where: { id: banner.id },
      data: {
        title: banner.title,
        subtitle: banner.subtitle,
        description: banner.description,
        image_path: banner.imagePath,
        link_url: banner.linkUrl,
        link_target: banner.linkTarget as PrismaLinkTarget,
        sort_order: banner.sortOrder,
        is_active: banner.isActive,
        start_date: banner.startDate,
        end_date: banner.endDate
      }
    });
  }

  async delete(id: number): Promise<void> {
    await prisma.mainBanner.delete({
      where: { id }
    });
  }
}