import { inject, injectable } from 'tsyringe';
import { ICategoryRepository } from '@/core/domain/repositories/ICategoryRepository';
import { CategoryDto } from '../../dtos/CategoryDto';

@injectable()
export class GetCategoriesUseCase {
  constructor(
    @inject('ICategoryRepository')
    private categoryRepository: ICategoryRepository
  ) {}

  async execute(includeInactive = false): Promise<CategoryDto[]> {
    const categories = await this.categoryRepository.findAll();
    
    const filteredCategories = includeInactive 
      ? categories 
      : categories.filter(cat => cat.isActive);

    return filteredCategories.map(CategoryDto.fromEntity);
  }

  async executeWithHierarchy(includeInactive = false): Promise<CategoryDto[]> {
    const categories = await this.categoryRepository.findAll();
    
    const filteredCategories = includeInactive 
      ? categories 
      : categories.filter(cat => cat.isActive);

    // Build hierarchy
    const categoryMap = new Map<number, CategoryDto>();
    const rootCategories: CategoryDto[] = [];

    // First pass: create all DTOs
    filteredCategories.forEach(cat => {
      const dto = CategoryDto.fromEntity(cat);
      categoryMap.set(cat.id, dto);
    });

    // Second pass: build hierarchy
    filteredCategories.forEach(cat => {
      const dto = categoryMap.get(cat.id)!;
      if (cat.parentId === null) {
        rootCategories.push(dto);
      } else {
        const parent = categoryMap.get(cat.parentId);
        if (parent) {
          if (!parent.children) {
            parent.children = [];
          }
          parent.children.push(dto);
        }
      }
    });

    // Sort by display order
    const sortByOrder = (a: CategoryDto, b: CategoryDto) => 
      (a.sortOrder || 0) - (b.sortOrder || 0);

    rootCategories.sort(sortByOrder);
    categoryMap.forEach(cat => {
      if (cat.children) {
        cat.children.sort(sortByOrder);
      }
    });

    return rootCategories;
  }
}