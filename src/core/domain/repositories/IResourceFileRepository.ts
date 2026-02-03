import { ResourceFile } from '../entities/ResourceFile';

export interface IResourceFileRepository {
  findById(id: number): Promise<ResourceFile | null>;
  findByResourceId(resourceId: number): Promise<ResourceFile[]>;
  create(file: ResourceFile): Promise<ResourceFile>;
  update(file: ResourceFile): Promise<ResourceFile>;
  delete(id: number): Promise<void>;
  deleteByResourceId(resourceId: number): Promise<void>;
  incrementDownloadCount(id: number): Promise<void>;
  updateSortOrder(id: number, sortOrder: number): Promise<void>;
}
