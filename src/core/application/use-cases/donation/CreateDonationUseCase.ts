import { Donation, DonationType } from '@/core/domain/entities/DonationNew';
import type { IDonationRepository } from '@/core/domain/repositories/IDonationRepository';
import { DonationDto } from '../../dtos/DonationDto';
interface CreateDonationRequest {
  sponsorId: number;
  donationType: DonationType;
  amount: number;
  paymentMethod?: string;
  paymentDate: Date;
  receiptNumber?: string;
  purpose?: string;
  memo?: string;
  message?: string;
  cmsBank?: string;
  cmsAccountNumber?: string;
  cmsAccountHolder?: string;
  cmsWithdrawalDay?: string;
}
export class CreateDonationUseCase {
  constructor(
    private donationRepository: IDonationRepository
  ) {}
  async execute(request: CreateDonationRequest): Promise<DonationDto> {
    // Use message field as memo if available
    const memo = request.message || request.memo || null;

    const donation = new Donation(
      0, // Will be assigned by database
      request.sponsorId,
      request.donationType,
      request.amount,
      request.paymentMethod || null,
      request.paymentDate,
      request.receiptNumber || null,
      request.purpose || null,
      memo,
      request.cmsBank || null,
      request.cmsAccountNumber || null,
      request.cmsAccountHolder || null,
      request.cmsWithdrawalDay || null,
      new Date(),
      new Date()
    );
    const savedDonation = await this.donationRepository.save(donation);
    return DonationDto.fromEntity(savedDonation);
  }
}