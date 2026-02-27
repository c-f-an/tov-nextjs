import { Donation, DonationType, DonationStatus, PaymentMethod } from '@/core/domain/entities/Donation';

export class DonationDto {
  id: string;
  userId: string;
  type: DonationType;
  status: DonationStatus;
  amount: number;
  paymentMethod: PaymentMethod;
  paymentDay?: number;
  startDate: Date;
  endDate?: Date;
  lastPaymentDate?: Date;
  nextPaymentDate?: Date;
  totalAmount: number;
  paymentCount: number;
  receiptRequired: boolean;
  receiptEmail?: string;
  receiptPhone?: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: DonationDto) {
    this.id = data.id;
    this.userId = data.userId;
    this.type = data.type;
    this.status = data.status;
    this.amount = data.amount;
    this.paymentMethod = data.paymentMethod;
    this.paymentDay = data.paymentDay;
    this.startDate = data.startDate;
    this.endDate = data.endDate;
    this.lastPaymentDate = data.lastPaymentDate;
    this.nextPaymentDate = data.nextPaymentDate;
    this.totalAmount = data.totalAmount;
    this.paymentCount = data.paymentCount;
    this.receiptRequired = data.receiptRequired;
    this.receiptEmail = data.receiptEmail;
    this.receiptPhone = data.receiptPhone;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  static fromEntity(donation: Donation): DonationDto {
    return new DonationDto({
      id: donation.id,
      userId: donation.userId,
      type: donation.type,
      status: donation.status,
      amount: donation.amount,
      paymentMethod: donation.paymentMethod,
      paymentDay: donation.paymentDay,
      startDate: donation.startDate,
      endDate: donation.endDate,
      lastPaymentDate: donation.lastPaymentDate,
      nextPaymentDate: donation.nextPaymentDate,
      totalAmount: donation.totalAmount,
      paymentCount: donation.paymentCount,
      receiptRequired: donation.receiptRequired,
      receiptEmail: donation.receiptEmail,
      receiptPhone: donation.receiptPhone,
      createdAt: donation.createdAt,
      updatedAt: donation.updatedAt,
    });
  }
}