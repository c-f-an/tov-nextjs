import { inject, injectable } from 'tsyringe';
import { Post, PostStatus } from '@/core/domain/entities/Post';
import type { IPostRepository } from '@/core/domain/repositories/IPostRepository';
import { PostDto } from '../../dtos/PostDto';

interface CreatePostRequest {
  categoryId: number;
  userId: number;
  title: string;
  content: string;
  isNotice?: boolean;
  attachmentUrls?: string[];
}

@injectable()
export class CreatePostUseCase {
  constructor(
    @inject('IPostRepository')
    private postRepository: IPostRepository
  ) {}

  async execute(request: CreatePostRequest): Promise<PostDto> {
    const post = new Post({
      id: 0, // Will be assigned by database
      categoryId: request.categoryId,
      userId: request.userId,
      title: request.title,
      content: request.content,
      status: PostStatus.published,
      viewCount: 0,
      isNotice: request.isNotice || false,
      attachmentUrls: request.attachmentUrls || [],
      createdAt: new Date(),
      updatedAt: new Date()
    });

    const savedPost = await this.postRepository.save(post);

    return PostDto.fromEntity(savedPost);
  }
}