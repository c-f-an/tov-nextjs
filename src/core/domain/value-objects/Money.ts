export class Money {
  private readonly amount: number;
  private readonly currency: string;

  constructor(amount: number, currency: string = 'KRW') {
    if (amount < 0) {
      throw new Error('Amount cannot be negative');
    }
    
    if (!Number.isInteger(amount)) {
      throw new Error('Amount must be an integer (in cents/won)');
    }

    this.amount = amount;
    this.currency = currency;
  }

  static fromWon(won: number): Money {
    return new Money(won, 'KRW');
  }

  getAmount(): number {
    return this.amount;
  }

  getCurrency(): string {
    return this.currency;
  }

  add(other: Money): Money {
    if (this.currency !== other.currency) {
      throw new Error('Cannot add money with different currencies');
    }
    return new Money(this.amount + other.amount, this.currency);
  }

  subtract(other: Money): Money {
    if (this.currency !== other.currency) {
      throw new Error('Cannot subtract money with different currencies');
    }
    
    if (this.amount < other.amount) {
      throw new Error('Insufficient amount');
    }
    
    return new Money(this.amount - other.amount, this.currency);
  }

  multiply(factor: number): Money {
    return new Money(Math.round(this.amount * factor), this.currency);
  }

  equals(other: Money): boolean {
    return this.amount === other.amount && this.currency === other.currency;
  }

  isGreaterThan(other: Money): boolean {
    if (this.currency !== other.currency) {
      throw new Error('Cannot compare money with different currencies');
    }
    return this.amount > other.amount;
  }

  isLessThan(other: Money): boolean {
    if (this.currency !== other.currency) {
      throw new Error('Cannot compare money with different currencies');
    }
    return this.amount < other.amount;
  }

  format(): string {
    if (this.currency === 'KRW') {
      return `₩${this.amount.toLocaleString('ko-KR')}`;
    }
    return `${this.amount.toLocaleString()} ${this.currency}`;
  }
}