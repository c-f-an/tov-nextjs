import { INewsRepository } from '@/core/domain/repositories/INewsRepository';

export class DeleteNewsUseCase {
  constructor(private newsRepository: INewsRepository) {}

  async execute(id: number): Promise<void> {
    const news = await this.newsRepository.findById(id);
    if (!news) {
      throw new Error('뉴스를 찾을 수 없습니다.');
    }

    await this.newsRepository.delete(id);
  }
}