import { Donation, DonationType, DonationStatus, PaymentMethod } from '@/core/domain/entities/Donation';
import type { IDonationRepository } from '@/core/domain/repositories/IDonationRepository';
import { DonationDto } from '../../dtos/DonationDto';
interface CreateDonationRequest {
  userId: string;
  donationType: DonationType;
  amount: number;
  paymentMethod: PaymentMethod;
  paymentDay?: number;
  startDate: Date;
  endDate?: Date;
  receiptRequired?: boolean;
  receiptEmail?: string;
  receiptPhone?: string;
}
export class CreateDonationUseCase {
  constructor(
    private donationRepository: IDonationRepository
  ) {}
  async execute(request: CreateDonationRequest): Promise<DonationDto> {
    const donation = Donation.create({
      userId: request.userId,
      type: request.donationType,
      amount: request.amount,
      paymentMethod: request.paymentMethod,
      startDate: request.startDate,
      paymentDay: request.paymentDay,
      endDate: request.endDate,
      receiptRequired: request.receiptRequired ?? false,
      receiptEmail: request.receiptEmail,
      receiptPhone: request.receiptPhone,
    });
    await this.donationRepository.save(donation);
    return DonationDto.fromEntity(donation);
  }
}