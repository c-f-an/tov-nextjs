import { inject, injectable } from 'tsyringe';
import { Donation, DonationType } from '@/core/domain/entities/DonationNew';
import { IDonationRepository } from '@/core/domain/repositories/IDonationNewRepository';
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
}

@injectable()
export class CreateDonationUseCase {
  constructor(
    @inject('IDonationRepository')
    private donationRepository: IDonationRepository
  ) {}

  async execute(request: CreateDonationRequest): Promise<DonationDto> {
    const donation = new Donation(
      0, // Will be assigned by database
      request.sponsorId,
      request.donationType,
      request.amount,
      request.paymentMethod || null,
      request.paymentDate,
      request.receiptNumber || null,
      request.purpose || null,
      request.memo || null,
      new Date(),
      new Date()
    );

    const savedDonation = await this.donationRepository.save(donation);

    return DonationDto.fromEntity(savedDonation);
  }
}