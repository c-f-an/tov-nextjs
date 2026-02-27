import type { IPostRepository } from '@/core/domain/repositories/IPostRepository';
import { PostDto } from '../../dtos/PostDto';
interface SearchPostsRequest {
  query: string;
  categoryId?: number;
  page?: number;
  limit?: number;
}
interface SearchPostsResponse {
  posts: PostDto[];
  total: number;
  page: number;
  totalPages: number;
  query: string;
}
export class SearchPostsUseCase {
  constructor(
    private postRepository: IPostRepository
  ) {}
  async execute(request: SearchPostsRequest): Promise<SearchPostsResponse> {
    const page = request.page || 1;
    const limit = request.limit || 10;
    const offset = (page - 1) * limit;
    const { posts, total } = await this.postRepository.searchPosts({
      query: request.query,
      categoryId: request.categoryId,
      offset,
      limit
    });
    return {
      posts: posts.map(post => PostDto.fromEntity(post)),
      total,
      page,
      totalPages: Math.ceil(total / limit),
      query: request.query
    };
  }
}