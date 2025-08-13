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
      prismaBanner.imagePath,
      prismaBanner.linkUrl,
      prismaBanner.linkTarget as LinkTarget,
      prismaBanner.sortOrder,
      prismaBanner.isActive,
      prismaBanner.startDate,
      prismaBanner.endDate,
      prismaBanner.createdAt || new Date(),
      prismaBanner.updatedAt || new Date()
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
      where: onlyActive ? { isActive: true } : undefined,
      orderBy: [
        { sortOrder: 'asc' },
        { createdAt: 'desc' }
      ]
    });

    return banners.map(banner => this.toDomain(banner));
  }

  async findActive(): Promise<MainBanner[]> {
    const now = new Date();
    
    const banners = await prisma.mainBanner.findMany({
      where: {
        isActive: true,
        OR: [
          { startDate: null, endDate: null },
          { startDate: { lte: now }, endDate: null },
          { startDate: null, endDate: { gte: now } },
          { startDate: { lte: now }, endDate: { gte: now } }
        ]
      },
      orderBy: [
        { sortOrder: 'asc' },
        { createdAt: 'desc' }
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
        imagePath: banner.imagePath,
        linkUrl: banner.linkUrl,
        linkTarget: banner.linkTarget as PrismaLinkTarget,
        sortOrder: banner.sortOrder,
        isActive: banner.isActive,
        startDate: banner.startDate,
        endDate: banner.endDate
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
        imagePath: banner.imagePath,
        linkUrl: banner.linkUrl,
        linkTarget: banner.linkTarget as PrismaLinkTarget,
        sortOrder: banner.sortOrder,
        isActive: banner.isActive,
        startDate: banner.startDate,
        endDate: banner.endDate
      }
    });
  }

  async delete(id: number): Promise<void> {
    await prisma.mainBanner.delete({
      where: { id }
    });
  }
}