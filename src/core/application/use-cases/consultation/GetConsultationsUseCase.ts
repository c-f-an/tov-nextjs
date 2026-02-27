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
export class GetConsultationsUseCase {
  constructor(
    private consultationRepository: IConsultationRepository
  ) {}
  async execute(request: GetConsultationsRequest): Promise<GetConsultationsResponse> {
    const page = request.page || 1;
    const limit = request.limit || 10;

    const result = await this.consultationRepository.findAll(
      {
        userId: request.userId,
        status: request.status
      },
      {
        page,
        limit
      }
    );

    return {
      consultations: result.data.map(ConsultationDto.fromEntity),
      total: result.total,
      page: result.page,
      totalPages: result.totalPages
    };
  }
}