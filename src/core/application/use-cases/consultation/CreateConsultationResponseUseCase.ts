import { ConsultationResponse, ResponseType } from '@/core/domain/entities/ConsultationResponse';
import type { IConsultationResponseRepository } from '@/core/domain/repositories/IConsultationResponseRepository';
import type { IConsultationRepository } from '@/core/domain/repositories/IConsultationRepository';
import { ConsultationResponseDto } from '../../dtos/ConsultationResponseDto';

export interface CreateConsultationResponseRequest {
  consultationId: number;
  responderId?: number;
  responderName?: string;
  responseType?: ResponseType;
  content: string;
  isPublic?: boolean;
}

export class CreateConsultationResponseUseCase {
  constructor(
    private consultationRepository: IConsultationRepository,
    private responseRepository: IConsultationResponseRepository
  ) {}

  async execute(request: CreateConsultationResponseRequest): Promise<ConsultationResponseDto> {
    const consultation = await this.consultationRepository.findById(request.consultationId);
    if (!consultation) {
      throw new Error('Consultation not found');
    }

    const response = ConsultationResponse.create({
      consultationId: request.consultationId,
      responderId: request.responderId ?? null,
      responderName: request.responderName ?? null,
      responseType: request.responseType ?? ResponseType.ANSWER,
      content: request.content,
      isPublic: request.isPublic ?? false,
    });

    const insertedId = await this.responseRepository.save(response);
    const saved = await this.responseRepository.findById(insertedId);
    if (!saved) throw new Error('Failed to retrieve saved response');
    return ConsultationResponseDto.fromEntity(saved);
  }
}
