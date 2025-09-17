import { INewsRepository } from '@/core/domain/repositories/INewsRepository';
import { News, NewsUpdateInput } from '@/core/domain/entities/News';

export class UpdateNewsUseCase {
  constructor(private newsRepository: INewsRepository) {}

  async execute(id: number, input: NewsUpdateInput): Promise<News> {
    const existingNews = await this.newsRepository.findById(id);
    if (!existingNews) {
      throw new Error('뉴스를 찾을 수 없습니다.');
    }

    // 발행 상태가 변경되고 발행 날짜가 없으면 현재 시간 설정
    if (input.isPublished === true && !existingNews.publishedAt && !input.publishedAt) {
      input.publishedAt = new Date();
    }

    return this.newsRepository.update(id, input);
  }
}