import { News, NewsCreateInput, NewsUpdateInput, NewsListParams, NewsListResponse } from '../entities/News';

export interface INewsRepository {
  create(input: NewsCreateInput): Promise<News>;
  update(id: number, input: NewsUpdateInput): Promise<News>;
  delete(id: number): Promise<void>;
  findById(id: number): Promise<News | null>;
  findAll(params: NewsListParams): Promise<NewsListResponse>;
  incrementViews(id: number): Promise<void>;
}