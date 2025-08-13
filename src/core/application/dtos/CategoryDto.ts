import { Category, CategoryType } from '@/core/domain/entities/Category';

export class CategoryDto {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  parentId: number | null;
  type: CategoryType;
  sortOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  children?: CategoryDto[];

  constructor(data: CategoryDto) {
    this.id = data.id;
    this.name = data.name;
    this.slug = data.slug;
    this.description = data.description;
    this.parentId = data.parentId;
    this.type = data.type;
    this.sortOrder = data.sortOrder;
    this.isActive = data.isActive;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.children = data.children;
  }

  static fromEntity(category: Category): CategoryDto {
    return new CategoryDto({
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      parentId: category.parentId,
      type: category.type,
      sortOrder: category.sortOrder,
      isActive: category.isActive,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt
    });
  }
}