import { inject, injectable } from 'tsyringe';
import { Consultation, ConsultationStatus } from '@/core/domain/entities/Consultation';
import { IConsultationRepository } from '@/core/domain/repositories/IConsultationRepository';
import { ConsultationDto } from '../../dtos/ConsultationDto';

interface CreateConsultationRequest {
  userId?: number;
  name: string;
  phone: string;
  email?: string;
  churchName?: string;
  position?: string;
  consultationType: string;
  preferredDate?: Date;
  preferredTime?: string;
  title: string;
  content: string;
  privacyAgree: boolean;
}

@injectable()
export class CreateConsultationUseCase {
  constructor(
    @inject('IConsultationRepository')
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
      request.churchName || null,
      request.position || null,
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