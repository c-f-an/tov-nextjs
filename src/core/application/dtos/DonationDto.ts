import { Donation, DonationType } from '@/core/domain/entities/DonationNew';
import { SponsorDto } from './SponsorDto';

export class DonationDto {
  id: number;
  sponsorId: number;
  donationType: DonationType;
  amount: number;
  paymentMethod: string | null;
  paymentDate: Date;
  receiptNumber: string | null;
  purpose: string | null;
  memo: string | null;
  createdAt: Date;
  updatedAt: Date;
  sponsor?: SponsorDto;

  constructor(data: DonationDto) {
    this.id = data.id;
    this.sponsorId = data.sponsorId;
    this.donationType = data.donationType;
    this.amount = data.amount;
    this.paymentMethod = data.paymentMethod;
    this.paymentDate = data.paymentDate;
    this.receiptNumber = data.receiptNumber;
    this.purpose = data.purpose;
    this.memo = data.memo;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.sponsor = data.sponsor;
  }

  static fromEntity(donation: Donation, includeRelations?: { sponsor?: SponsorDto }): DonationDto {
    return new DonationDto({
      id: donation.id,
      sponsorId: donation.sponsorId,
      donationType: donation.donationType,
      amount: donation.amount,
      paymentMethod: donation.paymentMethod,
      paymentDate: donation.paymentDate,
      receiptNumber: donation.receiptNumber,
      purpose: donation.purpose,
      memo: donation.memo,
      createdAt: donation.createdAt,
      updatedAt: donation.updatedAt,
      sponsor: includeRelations?.sponsor
    });
  }
}