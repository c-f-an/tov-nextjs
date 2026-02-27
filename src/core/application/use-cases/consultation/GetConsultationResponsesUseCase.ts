import type { IConsultationResponseRepository } from '@/core/domain/repositories/IConsultationResponseRepository';
import { ConsultationResponseDto } from '../../dtos/ConsultationResponseDto';

export class GetConsultationResponsesUseCase {
  constructor(private responseRepository: IConsultationResponseRepository) {}

  async execute(consultationId: number): Promise<ConsultationResponseDto[]> {
    const responses = await this.responseRepository.findByConsultationId(consultationId);
    return responses.map(ConsultationResponseDto.fromEntity);
  }
}
