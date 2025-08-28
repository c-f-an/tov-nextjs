import { inject, injectable } from 'tsyringe';
import type { IConsultationRepository } from '@/core/domain/repositories/IConsultationRepository';
import { ConsultationDto } from '../../dtos/ConsultationDto';
import { ConsultationStatus } from '@/core/domain/entities/Consultation';

interface GetConsultationsRequest {
  userId?: number;
  status?: ConsultationStatus;
  page?: number;
  limit?: number;
}

interface GetConsultationsResponse {
  consultations: ConsultationDto[];
  total: number;
  page: number;
  totalPages: number;
}

@injectable()
export class GetConsultationsUseCase {
  constructor(
    @inject('IConsultationRepository')
    private consultationRepository: IConsultationRepository
  ) {}

  async execute(request: GetConsultationsRequest): Promise<GetConsultationsResponse> {
    const page = request.page || 1;
    const limit = request.limit || 10;
    const offset = (page - 1) * limit;

    const { consultations, total } = await this.consultationRepository.findPaginated({
      userId: request.userId,
      status: request.status,
      offset,
      limit
    });

    return {
      consultations: consultations.map(ConsultationDto.fromEntity),
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
  }
}