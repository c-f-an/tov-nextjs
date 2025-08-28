import { inject, injectable } from 'tsyringe';
import type { IMainBannerRepository } from '@/core/domain/repositories/IMainBannerRepository';
import type { Result } from '@/shared/types/Result';
import { Ok, Err } from '@/shared/types/Result';
import { MainBanner } from '@/core/domain/entities/MainBanner';

export interface GetMainBannersInput {
  activeOnly?: boolean;
}

@injectable()
export class GetMainBannersUseCase {
  constructor(
    @inject('IMainBannerRepository')
    private mainBannerRepository: IMainBannerRepository
  ) {}

  async execute(input?: GetMainBannersInput): Promise<Result<MainBanner[]>> {
    try {
      let banners: MainBanner[];
      
      if (input?.activeOnly) {
        banners = await this.mainBannerRepository.findActive();
      } else {
        banners = await this.mainBannerRepository.findAll();
      }

      return Ok(banners);
    } catch (error) {
      console.error('Error in GetMainBannersUseCase:', error);
      return Err(new Error('Failed to get main banners'));
    }
  }
}