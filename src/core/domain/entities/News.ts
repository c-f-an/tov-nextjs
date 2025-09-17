export type NewsCategory = 'notice' | 'activity' | 'media' | 'publication' | 'laws';

export interface News {
  id: number;
  title: string;
  content: string;
  summary: string;
  category: NewsCategory;
  imageUrl?: string;
  author: string;
  views: number;
  isPublished: boolean;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface NewsCreateInput {
  title: string;
  content: string;
  summary: string;
  category: NewsCategory;
  imageUrl?: string;
  author: string;
  isPublished?: boolean;
  publishedAt?: Date;
}

export interface NewsUpdateInput {
  title?: string;
  content?: string;
  summary?: string;
  category?: NewsCategory;
  imageUrl?: string;
  author?: string;
  isPublished?: boolean;
  publishedAt?: Date;
}

export interface NewsListParams {
  category?: NewsCategory;
  searchTerm?: string;
  sortBy?: 'latest' | 'popular';
  page?: number;
  limit?: number;
  isPublished?: boolean;
}

export interface NewsListResponse {
  items: News[];
  total: number;
  page: number;
  totalPages: number;
}