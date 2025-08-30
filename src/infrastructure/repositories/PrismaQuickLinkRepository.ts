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
      prismaQuickLink.link_url,
      prismaQuickLink.description,
      prismaQuickLink.sort_order,
      prismaQuickLink.is_active,
      prismaQuickLink.created_at || new Date(),
      prismaQuickLink.updated_at || new Date()
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
      where: onlyActive ? { is_active: true } : undefined,
      orderBy: [
        { sort_order: 'asc' },
        { created_at: 'desc' }
      ]
    });

    return quickLinks.map(quickLink => this.toDomain(quickLink));
  }

  async findActive(): Promise<QuickLink[]> {
    const quickLinks = await prisma.quickLink.findMany({
      where: { is_active: true },
      orderBy: [
        { sort_order: 'asc' },
        { created_at: 'desc' }
      ]
    });

    return quickLinks.map(quickLink => this.toDomain(quickLink));
  }

  async save(quickLink: QuickLink): Promise<QuickLink> {
    const savedQuickLink = await prisma.quickLink.create({
      data: {
        title: quickLink.title,
        icon: quickLink.icon,
        link_url: quickLink.linkUrl,
        description: quickLink.description,
        sort_order: quickLink.sortOrder,
        is_active: quickLink.isActive
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
        link_url: quickLink.linkUrl,
        description: quickLink.description,
        sort_order: quickLink.sortOrder,
        is_active: quickLink.isActive
      }
    });
  }

  async delete(id: number): Promise<void> {
    await prisma.quickLink.delete({
      where: { id }
    });
  }
}