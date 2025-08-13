import { MainBanner } from '../entities/MainBanner';

export interface IMainBannerRepository {
  findById(id: number): Promise<MainBanner | null>;
  findAll(onlyActive?: boolean): Promise<MainBanner[]>;
  findActive(): Promise<MainBanner[]>;
  save(banner: MainBanner): Promise<MainBanner>;
  update(banner: MainBanner): Promise<void>;
  delete(id: number): Promise<void>;
}