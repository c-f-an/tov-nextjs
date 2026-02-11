export enum DonationType {
  regular = 'regular',
  one_time = 'one_time'
}

export class Donation {
  constructor(
    public readonly id: number,
    public readonly sponsorId: number,
    public readonly donationType: DonationType,
    public readonly amount: number,
    public readonly paymentMethod: string | null,
    public readonly paymentDate: Date,
    public readonly receiptNumber: string | null,
    public readonly purpose: string | null,
    public readonly memo: string | null,
    public readonly cmsBank: string | null,
    public readonly cmsAccountNumber: string | null,
    public readonly cmsAccountHolder: string | null,
    public readonly cmsWithdrawalDay: string | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}
}