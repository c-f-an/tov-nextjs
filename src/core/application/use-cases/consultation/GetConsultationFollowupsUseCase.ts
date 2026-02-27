import type { IConsultationFollowupRepository } from '@/core/domain/repositories/IConsultationFollowupRepository';
import { ConsultationFollowupDto } from '../../dtos/ConsultationFollowupDto';

export class GetConsultationFollowupsUseCase {
  constructor(private followupRepository: IConsultationFollowupRepository) {}

  async execute(originalConsultationId: number): Promise<ConsultationFollowupDto[]> {
    const followups = await this.followupRepository.findByOriginalConsultationId(originalConsultationId);
    return followups.map(ConsultationFollowupDto.fromEntity);
  }
}
