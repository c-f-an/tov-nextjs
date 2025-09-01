import { Category, CategoryType } from '@/core/domain/entities/Category';
import type { ICategoryRepository } from '@/core/domain/repositories/ICategoryRepository';
import { CategoryDto } from '../../dtos/CategoryDto';
interface CreateCategoryRequest {
  name: string;
  slug: string;
  description?: string;
  parentId?: number;
  type: CategoryType;
  sortOrder?: number;
  isActive?: boolean;
}
export class CreateCategoryUseCase {
  constructor(
    private categoryRepository: ICategoryRepository
  ) {}
  async execute(request: CreateCategoryRequest): Promise<CategoryDto> {
    // Check if slug already exists
    const existingCategory = await this.categoryRepository.findBySlug(request.slug);
    if (existingCategory) {
      throw new Error('Category with this slug already exists');
    }
    // Create category
    const category = new Category(
      0, // Will be assigned by database
      request.name,
      request.slug,
      request.description || null,
      request.parentId || null,
      request.type,
      request.sortOrder ?? 0,
      request.isActive ?? true,
      new Date(),
      new Date()
    );
    const savedCategory = await this.categoryRepository.save(category);
    return CategoryDto.fromEntity(savedCategory);
  }
}