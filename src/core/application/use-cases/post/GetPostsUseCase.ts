import type { IPostRepository } from '@/core/domain/repositories/IPostRepository';
import { PostDto } from '../../dtos/PostDto';
interface GetPostsRequest {
  categoryId?: number;
  page?: number;
  limit?: number;
  includeNotices?: boolean;
}
interface GetPostsResponse {
  posts: PostDto[];
  total: number;
  page: number;
  totalPages: number;
}
export class GetPostsUseCase {
  constructor(
    private postRepository: IPostRepository
  ) {}
  async execute(request: GetPostsRequest): Promise<GetPostsResponse> {
    const page = request.page || 1;
    const limit = request.limit || 10;
    const offset = (page - 1) * limit;
    const { posts, total } = await this.postRepository.findPaginated({
      categoryId: request.categoryId,
      offset,
      limit,
      includeNotices: request.includeNotices
    });
    return {
      posts: posts.map(post => {
        const dto = PostDto.fromEntity(post);
        return {
          id: dto.id,
          categoryId: dto.categoryId,
          userId: dto.userId,
          title: dto.title,
          content: dto.content,
          status: dto.status,
          viewCount: dto.viewCount,
          isNotice: dto.isNotice,
          attachmentUrls: dto.attachmentUrls,
          createdAt: dto.createdAt,
          updatedAt: dto.updatedAt,
          category: dto.category,
          user: dto.user
        };
      }),
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
  }
}