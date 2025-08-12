export enum DonationType {
  REGULAR = 'REGULAR',
  ONETIME = 'ONETIME'
}

export enum DonationStatus {
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED'
}

export enum PaymentMethod {
  CREDIT_CARD = 'CREDIT_CARD',
  BANK_TRANSFER = 'BANK_TRANSFER',
  VIRTUAL_ACCOUNT = 'VIRTUAL_ACCOUNT'
}

export interface IDonation {
  id: string;
  userId: string;
  type: DonationType;
  status: DonationStatus;
  amount: number;
  paymentMethod: PaymentMethod;
  paymentDay?: number; // 정기 후원인 경우 결제일
  startDate: Date;
  endDate?: Date;
  lastPaymentDate?: Date;
  nextPaymentDate?: Date;
  totalAmount: number; // 누적 후원 금액
  paymentCount: number; // 결제 횟수
  receiptRequired: boolean;
  receiptEmail?: string;
  receiptPhone?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class Donation implements IDonation {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly type: DonationType,
    public readonly status: DonationStatus,
    public readonly amount: number,
    public readonly paymentMethod: PaymentMethod,
    public readonly startDate: Date,
    public readonly totalAmount: number,
    public readonly paymentCount: number,
    public readonly receiptRequired: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly paymentDay?: number,
    public readonly endDate?: Date,
    public readonly lastPaymentDate?: Date,
    public readonly nextPaymentDate?: Date,
    public readonly receiptEmail?: string,
    public readonly receiptPhone?: string
  ) {}

  static create(params: Omit<IDonation, 'id' | 'status' | 'totalAmount' | 'paymentCount' | 'createdAt' | 'updatedAt' | 'lastPaymentDate' | 'nextPaymentDate'>): Donation {
    const now = new Date();
    let nextPaymentDate: Date | undefined;

    if (params.type === DonationType.REGULAR && params.paymentDay) {
      nextPaymentDate = new Date(now);
      nextPaymentDate.setDate(params.paymentDay);
      if (nextPaymentDate <= now) {
        nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);
      }
    }

    return new Donation(
      crypto.randomUUID(),
      params.userId,
      params.type,
      DonationStatus.ACTIVE,
      params.amount,
      params.paymentMethod,
      params.startDate,
      0,
      0,
      params.receiptRequired,
      now,
      now,
      params.paymentDay,
      params.endDate,
      undefined,
      nextPaymentDate,
      params.receiptEmail,
      params.receiptPhone
    );
  }

  processPayment(): Donation {
    const newTotalAmount = this.totalAmount + this.amount;
    const newPaymentCount = this.paymentCount + 1;
    const lastPaymentDate = new Date();
    let nextPaymentDate: Date | undefined;

    if (this.type === DonationType.REGULAR && this.paymentDay) {
      nextPaymentDate = new Date(lastPaymentDate);
      nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);
      nextPaymentDate.setDate(this.paymentDay);
    }

    return new Donation(
      this.id,
      this.userId,
      this.type,
      this.status,
      this.amount,
      this.paymentMethod,
      this.startDate,
      newTotalAmount,
      newPaymentCount,
      this.receiptRequired,
      this.createdAt,
      new Date(),
      this.paymentDay,
      this.endDate,
      lastPaymentDate,
      nextPaymentDate,
      this.receiptEmail,
      this.receiptPhone
    );
  }

  pause(): Donation {
    return new Donation(
      this.id,
      this.userId,
      this.type,
      DonationStatus.PAUSED,
      this.amount,
      this.paymentMethod,
      this.startDate,
      this.totalAmount,
      this.paymentCount,
      this.receiptRequired,
      this.createdAt,
      new Date(),
      this.paymentDay,
      this.endDate,
      this.lastPaymentDate,
      undefined,
      this.receiptEmail,
      this.receiptPhone
    );
  }

  cancel(): Donation {
    return new Donation(
      this.id,
      this.userId,
      this.type,
      DonationStatus.CANCELLED,
      this.amount,
      this.paymentMethod,
      this.startDate,
      this.totalAmount,
      this.paymentCount,
      this.receiptRequired,
      this.createdAt,
      new Date(),
      this.paymentDay,
      new Date(),
      this.lastPaymentDate,
      undefined,
      this.receiptEmail,
      this.receiptPhone
    );
  }
}