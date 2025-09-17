import { INewsRepository } from '@/core/domain/repositories/INewsRepository';
import { NewsListParams, NewsListResponse } from '@/core/domain/entities/News';

export class GetNewsListUseCase {
  constructor(private newsRepository: INewsRepository) {}

  async execute(params: NewsListParams): Promise<NewsListResponse> {
    // 관리자가 아닌 경우 발행된 뉴스만 조회
    if (params.isPublished === undefined) {
      params.isPublished = true;
    }

    return this.newsRepository.findAll(params);
  }
}