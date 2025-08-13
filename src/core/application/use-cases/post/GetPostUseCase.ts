import { inject, injectable } from 'tsyringe';
import { IPostRepository } from '@/core/domain/repositories/IPostRepository';
import { PostDto } from '../../dtos/PostDto';

@injectable()
export class GetPostUseCase {
  constructor(
    @inject('IPostRepository')
    private postRepository: IPostRepository
  ) {}

  async execute(postId: number): Promise<PostDto | null> {
    const post = await this.postRepository.findById(postId);
    
    if (!post) {
      return null;
    }

    // Increment view count
    await this.postRepository.incrementViewCount(postId);

    return PostDto.fromEntity(post);
  }
}