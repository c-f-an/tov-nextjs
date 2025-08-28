import { inject, injectable } from 'tsyringe';
import { IQuickLinkRepository } from '@/core/domain/repositories/IQuickLinkRepository';
import { Result } from '@/shared/types/Result';
import { QuickLink } from '@/core/domain/entities/QuickLink';

export interface GetQuickLinksInput {
  activeOnly?: boolean;
}

@injectable()
export class GetQuickLinksUseCase {
  constructor(
    @inject('IQuickLinkRepository')
    private quickLinkRepository: IQuickLinkRepository
  ) {}

  async execute(input?: GetQuickLinksInput): Promise<Result<QuickLink[]>> {
    try {
      let quickLinks: QuickLink[];
      
      if (input?.activeOnly) {
        quickLinks = await this.quickLinkRepository.findActive();
      } else {
        quickLinks = await this.quickLinkRepository.findAll();
      }

      return Result.ok(quickLinks);
    } catch (error) {
      console.error('Error in GetQuickLinksUseCase:', error);
      return Result.fail('Failed to get quick links');
    }
  }
}