import { Post, PostStatus } from '../entities/Post';

interface PostFilters {
  categoryId?: number;
  status?: PostStatus;
  authorId?: number;
  search?: string;
  includeNotices?: boolean;
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

interface SearchPostsParams {
  query: string;
  categoryId?: number;
  offset: number;
  limit: number;
}

interface SearchPostsResult {
  posts: Post[];
  total: number;
}

interface IPostRepository {
  findById(id: number): Promise<Post | null>;
  findBySlug(slug: string): Promise<Post | null>;
  findAll(filters: PostFilters, pagination: PaginationParams): Promise<PaginatedResult<Post>>;
  save(post: Post): Promise<Post>;
  update(post: Post): Promise<void>;
  delete(id: number): Promise<void>;
  incrementViewCount(id: number): Promise<void>;
  searchPosts(params: SearchPostsParams): Promise<SearchPostsResult>;
}

export type { IPostRepository, PostFilters, PaginationParams, PaginatedResult, SearchPostsParams, SearchPostsResult };
