import { inject, injectable } from 'tsyringe';
import { IConsultationRepository } from '@/core/domain/repositories/IConsultationRepository';
import { ConsultationDto } from '../../dtos/ConsultationDto';

@injectable()
export class GetConsultationUseCase {
  constructor(
    @inject('IConsultationRepository')
    private consultationRepository: IConsultationRepository
  ) {}

  async execute(consultationId: number, userId?: number): Promise<ConsultationDto | null> {
    const consultation = await this.consultationRepository.findById(consultationId);
    
    if (!consultation) {
      return null;
    }

    // Check if user has permission to view this consultation
    if (userId && consultation.userId && consultation.userId !== userId) {
      throw new Error('Unauthorized to view this consultation');
    }

    return ConsultationDto.fromEntity(consultation);
  }
}