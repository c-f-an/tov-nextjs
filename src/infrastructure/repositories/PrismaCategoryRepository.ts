import { injectable } from 'tsyringe';
import { PrismaClient } from '@prisma/client';
import { Category, CategoryType } from '@/core/domain/entities/Category';
import { ICategoryRepository } from '@/core/domain/repositories/ICategoryRepository';
import { prisma } from '../database/prisma';

@injectable()
export class PrismaCategoryRepository implements ICategoryRepository {
  private prisma: PrismaClient = prisma;

  async save(category: Category): Promise<Category> {
    const data = {
      name: category.name,
      slug: category.slug,
      description: category.description,
      parent_id: category.parentId,
      type: category.type,
      sort_order: category.sortOrder,
      is_active: category.isActive
    };

    const saved = category.id
      ? await this.prisma.category.update({
          where: { id: category.id },
          data
        })
      : await this.prisma.category.create({ data });

    return this.mapToEntity(saved);
  }

  async findById(id: number): Promise<Category | null> {
    const category = await this.prisma.category.findUnique({
      where: { id }
    });

    return category ? this.mapToEntity(category) : null;
  }

  async findBySlug(slug: string): Promise<Category | null> {
    const category = await this.prisma.category.findUnique({
      where: { slug }
    });

    return category ? this.mapToEntity(category) : null;
  }

  async findAll(): Promise<Category[]> {
    const categories = await this.prisma.category.findMany({
      orderBy: [
        { parent_id: 'asc' },
        { sort_order: 'asc' },
        { name: 'asc' }
      ]
    });

    return categories.map(this.mapToEntity);
  }

  async findByParentId(parentId: number | null): Promise<Category[]> {
    const categories = await this.prisma.category.findMany({
      where: { parent_id: parentId },
      orderBy: [
        { sort_order: 'asc' },
        { name: 'asc' }
      ]
    });

    return categories.map(this.mapToEntity);
  }

  async delete(id: number): Promise<void> {
    await this.prisma.category.delete({
      where: { id }
    });
  }

  private mapToEntity(prismaCategory: any): Category {
    return new Category(
      prismaCategory.id,
      prismaCategory.name,
      prismaCategory.slug,
      prismaCategory.description,
      prismaCategory.parent_id,
      prismaCategory.type as CategoryType,
      prismaCategory.sort_order,
      prismaCategory.is_active,
      prismaCategory.created_at,
      prismaCategory.updated_at
    );
  }
}