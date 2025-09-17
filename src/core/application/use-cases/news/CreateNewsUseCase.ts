import { INewsRepository } from '@/core/domain/repositories/INewsRepository';
import { News, NewsCreateInput } from '@/core/domain/entities/News';

export class CreateNewsUseCase {
  constructor(private newsRepository: INewsRepository) {}

  async execute(input: NewsCreateInput): Promise<News> {
    // 발행 날짜 설정
    if (input.isPublished && !input.publishedAt) {
      input.publishedAt = new Date();
    }

    return this.newsRepository.create(input);
  }
}