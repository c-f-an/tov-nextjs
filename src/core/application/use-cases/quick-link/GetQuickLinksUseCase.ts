import type { IQuickLinkRepository } from '@/core/domain/repositories/IQuickLinkRepository';
import type { Result } from '@/shared/types/Result';
import { Ok, Err } from '@/shared/types/Result';
import { QuickLink } from '@/core/domain/entities/QuickLink';
export interface GetQuickLinksInput {
  activeOnly?: boolean;
}
export class GetQuickLinksUseCase {
  constructor(
    private quickLinkRepository: IQuickLinkRepository
  ) {}
  async execute(input?: GetQuickLinksInput): Promise<Result<QuickLink[]>> {
    try {
      let quickLinks: QuickLink[];
      if (input?.activeOnly) {
        quickLinks = await this.quickLinkRepository.findAll(true);
      } else {
        quickLinks = await this.quickLinkRepository.findAll();
      }
      return Ok(quickLinks);
    } catch (error) {
      console.error('Error in GetQuickLinksUseCase:', error);
      return Err(new Error('Failed to get quick links'));
    }
  }
}