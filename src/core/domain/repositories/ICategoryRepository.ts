import { Category } from '../entities/Category';

export interface ICategoryRepository {
  save(category: Category): Promise<Category>;
  findById(id: number): Promise<Category | null>;
  findBySlug(slug: string): Promise<Category | null>;
  findAll(): Promise<Category[]>;
  findByParentId(parentId: number | null): Promise<Category[]>;
  delete(id: number): Promise<void>;
}