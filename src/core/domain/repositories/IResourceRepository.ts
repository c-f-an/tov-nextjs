import { Resource } from '../entities/Resource';

export interface ResourceFilter {
  categoryId?: number;
  resourceType?: string;
  isFeatured?: boolean;
  isActive?: boolean;
  searchTerm?: string;
  tags?: string[];
}

export interface PaginationOptions {
  page: number;
  limit: number;
  orderBy?: string;
  orderDirection?: 'ASC' | 'DESC';
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  totalPages: number;
}

export interface IResourceRepository {
  findAll(filter?: ResourceFilter, pagination?: PaginationOptions): Promise<PaginatedResult<Resource>>;
  findById(id: number): Promise<Resource | null>;
  findByCategoryId(categoryId: number, pagination?: PaginationOptions): Promise<PaginatedResult<Resource>>;
  findFeatured(limit?: number): Promise<Resource[]>;
  create(resource: Resource): Promise<Resource>;
  update(resource: Resource): Promise<Resource>;
  delete(id: number): Promise<void>;
  incrementDownloadCount(id: number): Promise<void>;
  incrementViewCount(id: number): Promise<void>;
  logDownload(resourceId: number, userId: number | null, ipAddress: string, userAgent: string | null): Promise<void>;
}