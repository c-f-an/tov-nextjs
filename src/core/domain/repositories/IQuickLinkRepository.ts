import { QuickLink } from '../entities/QuickLink';

interface IQuickLinkRepository {
  findById(id: number): Promise<QuickLink | null>;
  findAll(onlyActive?: boolean): Promise<QuickLink[]>;
  save(quickLink: QuickLink): Promise<QuickLink>;
  update(quickLink: QuickLink): Promise<void>;
  delete(id: number): Promise<void>;
}

export type { IQuickLinkRepository };