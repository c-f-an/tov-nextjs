export class FinancialReport {
  constructor(
    public id: number | null,
    public reportYear: number,
    public reportMonth: number | null,
    public title: string,
    public content: string | null,
    public totalIncome: number | null,
    public totalExpense: number | null,
    public balance: number | null,
    public publishedAt: Date | null,
    public createdAt: Date | null,
    public updatedAt: Date | null
  ) {}

  static create(props: {
    reportYear: number;
    reportMonth?: number | null;
    title: string;
    content?: string | null;
    totalIncome?: number | null;
    totalExpense?: number | null;
    balance?: number | null;
    publishedAt?: Date | null;
  }): FinancialReport {
    return new FinancialReport(
      null,
      props.reportYear,
      props.reportMonth || null,
      props.title,
      props.content || null,
      props.totalIncome || null,
      props.totalExpense || null,
      props.balance || null,
      props.publishedAt || null,
      new Date(),
      new Date()
    );
  }

  getFormattedPeriod(): string {
    if (this.reportMonth) {
      return `${this.reportYear}년 ${this.reportMonth}월`;
    }
    return `${this.reportYear}년`;
  }

  getFormattedIncome(): string {
    if (this.totalIncome === null) return '-';
    return this.formatCurrency(this.totalIncome);
  }

  getFormattedExpense(): string {
    if (this.totalExpense === null) return '-';
    return this.formatCurrency(this.totalExpense);
  }

  getFormattedBalance(): string {
    if (this.balance === null) return '-';
    return this.formatCurrency(this.balance);
  }

  private formatCurrency(amount: number): string {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW'
    }).format(amount);
  }
}