import { Post, PostCategory, PostStatus } from '../entities/Post';

interface PostFilters {
  category?: PostCategory;
  status?: PostStatus;
  authorId?: string;
  search?: string;
}

interface PaginationParams {
  page: number;
  limit: number;
}

interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
}

interface IPostRepository {
  findById(id: string): Promise<Post | null>;
  findBySlug(slug: string): Promise<Post | null>;
  findAll(filters: PostFilters, pagination: PaginationParams): Promise<PaginatedResult<Post>>;
  save(post: Post): Promise<void>;
  update(post: Post): Promise<void>;
  delete(id: string): Promise<void>;
  incrementViewCount(id: string): Promise<void>;
}

export type { IPostRepository, PostFilters, PaginationParams, PaginatedResult };