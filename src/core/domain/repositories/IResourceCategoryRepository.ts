import { ResourceCategory } from '../entities/ResourceCategory';

export interface IResourceCategoryRepository {
  findAll(): Promise<ResourceCategory[]>;
  findActive(): Promise<ResourceCategory[]>;
  findById(id: number): Promise<ResourceCategory | null>;
  findBySlug(slug: string): Promise<ResourceCategory | null>;
  create(category: ResourceCategory): Promise<ResourceCategory>;
  update(category: ResourceCategory): Promise<ResourceCategory>;
  delete(id: number): Promise<void>;
}