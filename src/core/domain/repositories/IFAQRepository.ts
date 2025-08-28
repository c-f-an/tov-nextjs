import { FAQ } from '../entities/FAQ';

interface IFAQRepository {
  findById(id: number): Promise<FAQ | null>;
  findByCategory(category: string): Promise<FAQ[]>;
  findAll(onlyActive?: boolean): Promise<FAQ[]>;
  getCategories(): Promise<string[]>;
  save(faq: FAQ): Promise<FAQ>;
  update(faq: FAQ): Promise<void>;
  delete(id: number): Promise<void>;
  search(query: string): Promise<FAQ[]>;
}

export type { IFAQRepository };