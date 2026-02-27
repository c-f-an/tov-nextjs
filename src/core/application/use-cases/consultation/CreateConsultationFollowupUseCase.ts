import { ConsultationFollowup, MeetingType } from '@/core/domain/entities/ConsultationFollowup';
import type { IConsultationFollowupRepository } from '@/core/domain/repositories/IConsultationFollowupRepository';
import type { IConsultationRepository } from '@/core/domain/repositories/IConsultationRepository';
import { ConsultationFollowupDto } from '../../dtos/ConsultationFollowupDto';

export interface CreateConsultationFollowupRequest {
  originalConsultationId: number;
  followupConsultationId?: number;
  meetingType?: MeetingType;
  scheduledAt?: Date;
  topic?: string;
  notes?: string;
  assignedTo?: number;
}

export class CreateConsultationFollowupUseCase {
  constructor(
    private consultationRepository: IConsultationRepository,
    private followupRepository: IConsultationFollowupRepository
  ) {}

  async execute(request: CreateConsultationFollowupRequest): Promise<ConsultationFollowupDto> {
    const consultation = await this.consultationRepository.findById(request.originalConsultationId);
    if (!consultation) {
      throw new Error('Consultation not found');
    }

    const nextOrder = await this.followupRepository.getNextFollowupOrder(request.originalConsultationId);

    const followup = ConsultationFollowup.create({
      originalConsultationId: request.originalConsultationId,
      followupConsultationId: request.followupConsultationId ?? null,
      followupOrder: nextOrder,
      meetingType: request.meetingType ?? null,
      scheduledAt: request.scheduledAt ?? null,
      metAt: null,
      topic: request.topic ?? null,
      notes: request.notes ?? null,
      assignedTo: request.assignedTo ?? null,
    });

    const insertedId = await this.followupRepository.save(followup);
    const saved = await this.followupRepository.findById(insertedId);
    if (!saved) throw new Error('Failed to retrieve saved followup');
    return ConsultationFollowupDto.fromEntity(saved);
  }
}
