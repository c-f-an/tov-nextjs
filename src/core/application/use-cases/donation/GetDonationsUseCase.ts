import type { IDonationRepository } from '@/core/domain/repositories/IDonationRepository';
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
export class GetDonationsUseCase {
  constructor(
    private donationRepository: IDonationRepository
  ) {}
  async execute(request: GetDonationsRequest): Promise<GetDonationsResponse> {
    const page = request.page || 1;
    const limit = request.limit || 10;

    // Get donations with pagination
    const result = await this.donationRepository.findAll(
      {
        userId: request.sponsorId?.toString(),
        dateFrom: request.startDate,
        dateTo: request.endDate
      },
      {
        page,
        limit
      }
    );

    // Calculate total amount from the donations
    const totalAmount = result.data.reduce((sum, donation) => sum + donation.amount, 0);

    return {
      donations: result.data.map(DonationDto.fromEntity),
      total: result.total,
      totalAmount,
      page: result.page,
      totalPages: result.totalPages
    };
  }
}