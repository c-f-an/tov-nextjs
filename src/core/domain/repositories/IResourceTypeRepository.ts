import { ResourceType } from '../entities/ResourceType';

export interface IResourceTypeRepository {
  findAll(): Promise<ResourceType[]>;
  findById(id: number): Promise<ResourceType | null>;
  findByCode(code: string): Promise<ResourceType | null>;
  findByCodes(codes: string[]): Promise<ResourceType[]>;
  findByResourceId(resourceId: number): Promise<ResourceType[]>;
  create(type: ResourceType): Promise<ResourceType>;
  update(type: ResourceType): Promise<ResourceType>;
  delete(id: number): Promise<void>;

  // Pivot table operations
  setResourceTypes(resourceId: number, typeIds: number[]): Promise<void>;
  addResourceType(resourceId: number, typeId: number): Promise<void>;
  removeResourceType(resourceId: number, typeId: number): Promise<void>;
  clearResourceTypes(resourceId: number): Promise<void>;
}
