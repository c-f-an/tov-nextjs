import { inject, injectable } from 'tsyringe';
import { IPostRepository } from '@/core/domain/repositories/IPostRepository';
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

@injectable()
export class GetPostsUseCase {
  constructor(
    @inject('IPostRepository')
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
      posts: posts.map(PostDto.fromEntity),
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
  }
}