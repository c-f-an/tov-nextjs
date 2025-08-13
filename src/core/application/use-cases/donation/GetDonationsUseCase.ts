import { inject, injectable } from 'tsyringe';
import { IDonationRepository } from '@/core/domain/repositories/IDonationNewRepository';
import { DonationDto } from '../../dtos/DonationDto';

interface GetDonationsRequest {
  sponsorId?: number;
  page?: number;
  limit?: number;
  startDate?: Date;
  endDate?: Date;
}

interface GetDonationsResponse {
  donations: DonationDto[];
  total: number;
  totalAmount: number;
  page: number;
  totalPages: number;
}

@injectable()
export class GetDonationsUseCase {
  constructor(
    @inject('IDonationRepository')
    private donationRepository: IDonationRepository
  ) {}

  async execute(request: GetDonationsRequest): Promise<GetDonationsResponse> {
    const page = request.page || 1;
    const limit = request.limit || 10;
    const offset = (page - 1) * limit;

    const { donations, total, totalAmount } = await this.donationRepository.findPaginated({
      sponsorId: request.sponsorId,
      offset,
      limit,
      startDate: request.startDate,
      endDate: request.endDate
    });

    return {
      donations: donations.map(DonationDto.fromEntity),
      total,
      totalAmount,
      page,
      totalPages: Math.ceil(total / limit)
    };
  }
}