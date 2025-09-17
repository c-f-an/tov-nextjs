import { INewsRepository } from '@/core/domain/repositories/INewsRepository';
import { News } from '@/core/domain/entities/News';

export class GetNewsDetailUseCase {
  constructor(private newsRepository: INewsRepository) {}

  async execute(id: number): Promise<News | null> {
    const news = await this.newsRepository.findById(id);
    
    if (news && news.isPublished) {
      // 조회수 증가
      await this.newsRepository.incrementViews(id);
    }

    return news;
  }
}