import { inject, injectable } from 'tsyringe';
import { IMainBannerRepository } from '@/core/domain/repositories/IMainBannerRepository';
import { Result } from '@/shared/types/Result';
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

      return Result.ok(banners);
    } catch (error) {
      console.error('Error in GetMainBannersUseCase:', error);
      return Result.fail('Failed to get main banners');
    }
  }
}