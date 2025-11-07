import type { IPostRepository } from '@/core/domain/repositories/IPostRepository';
import { PostDto } from '../../dtos/PostDto';
import { PostStatus } from '@/core/domain/entities/Post';

interface GetPostsRequest {
  categoryId?: number;
  page?: number;
  limit?: number;
  includeNotices?: boolean;
  status?: PostStatus;
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

    const result = await this.postRepository.findAll({
      categoryId: request.categoryId,
      includeNotices: request.includeNotices,
      status: request.status
    }, {
      page,
      limit
    });
    
    return {
      posts: result.data.map(post => {
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
      total: result.total,
      page: result.page,
      totalPages: result.totalPages
    };
  }
}