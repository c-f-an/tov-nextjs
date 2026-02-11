import { Consultation, ConsultationStatus } from '@/core/domain/entities/Consultation';
import type { IConsultationRepository } from '@/core/domain/repositories/IConsultationRepository';
import { ConsultationDto } from '../../dtos/ConsultationDto';
interface CreateConsultationRequest {
  userId?: number;
  name: string;
  phone: string;
  email?: string;
  consultationType: string;
  preferredDate?: Date;
  preferredTime?: string;
  title: string;
  content: string;
  privacyAgree: boolean;
}
export class CreateConsultationUseCase {
  constructor(
    private consultationRepository: IConsultationRepository
  ) {}
  async execute(request: CreateConsultationRequest): Promise<ConsultationDto> {
    if (!request.privacyAgree) {
      throw new Error('Privacy agreement is required');
    }
    const consultation = new Consultation(
      0, // Will be assigned by database
      request.userId || null,
      request.name,
      request.phone,
      request.email || null,
      request.consultationType,
      request.preferredDate || null,
      request.preferredTime || null,
      request.title,
      request.content,
      ConsultationStatus.pending,
      null, // assignedTo
      null, // consultationDate
      null, // consultationNotes
      request.privacyAgree,
      new Date(),
      new Date()
    );
    const savedConsultation = await this.consultationRepository.save(consultation);
    return ConsultationDto.fromEntity(savedConsultation);
  }
}