import { QuickLink } from '@/core/domain/entities/QuickLink';
import { IQuickLinkRepository } from '@/core/domain/repositories/IQuickLinkRepository';
import { prisma } from '../database/prisma';
import { QuickLink as PrismaQuickLink } from '@prisma/client';

export class PrismaQuickLinkRepository implements IQuickLinkRepository {
  private toDomain(prismaQuickLink: PrismaQuickLink): QuickLink {
    return new QuickLink(
      prismaQuickLink.id,
      prismaQuickLink.title,
      prismaQuickLink.icon,
      prismaQuickLink.linkUrl,
      prismaQuickLink.description,
      prismaQuickLink.sortOrder,
      prismaQuickLink.isActive,
      prismaQuickLink.createdAt || new Date(),
      prismaQuickLink.updatedAt || new Date()
    );
  }

  async findById(id: number): Promise<QuickLink | null> {
    const quickLink = await prisma.quickLink.findUnique({
      where: { id }
    });

    return quickLink ? this.toDomain(quickLink) : null;
  }

  async findAll(onlyActive: boolean = true): Promise<QuickLink[]> {
    const quickLinks = await prisma.quickLink.findMany({
      where: onlyActive ? { isActive: true } : undefined,
      orderBy: [
        { sortOrder: 'asc' },
        { createdAt: 'desc' }
      ]
    });

    return quickLinks.map(quickLink => this.toDomain(quickLink));
  }

  async save(quickLink: QuickLink): Promise<QuickLink> {
    const savedQuickLink = await prisma.quickLink.create({
      data: {
        title: quickLink.title,
        icon: quickLink.icon,
        linkUrl: quickLink.linkUrl,
        description: quickLink.description,
        sortOrder: quickLink.sortOrder,
        isActive: quickLink.isActive
      }
    });

    return this.toDomain(savedQuickLink);
  }

  async update(quickLink: QuickLink): Promise<void> {
    await prisma.quickLink.update({
      where: { id: quickLink.id },
      data: {
        title: quickLink.title,
        icon: quickLink.icon,
        linkUrl: quickLink.linkUrl,
        description: quickLink.description,
        sortOrder: quickLink.sortOrder,
        isActive: quickLink.isActive
      }
    });
  }

  async delete(id: number): Promise<void> {
    await prisma.quickLink.delete({
      where: { id }
    });
  }
}