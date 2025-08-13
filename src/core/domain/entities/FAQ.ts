export class FAQ {
  constructor(
    public readonly id: number,
    public category: string,
    public question: string,
    public answer: string,
    public sortOrder: number,
    public isActive: boolean,
    public viewCount: number,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  static create(data: {
    category: string;
    question: string;
    answer: string;
    sortOrder?: number;
    isActive?: boolean;
  }): FAQ {
    return new FAQ(
      0,
      data.category,
      data.question,
      data.answer,
      data.sortOrder || 0,
      data.isActive !== undefined ? data.isActive : true,
      0,
      new Date(),
      new Date()
    );
  }

  updateContent(data: {
    category?: string;
    question?: string;
    answer?: string;
  }): void {
    if (data.category !== undefined) this.category = data.category;
    if (data.question !== undefined) this.question = data.question;
    if (data.answer !== undefined) this.answer = data.answer;
  }

  updateSortOrder(sortOrder: number): void {
    this.sortOrder = sortOrder;
  }

  toggleActive(): void {
    this.isActive = !this.isActive;
  }

  activate(): void {
    this.isActive = true;
  }

  deactivate(): void {
    this.isActive = false;
  }

  incrementViewCount(): void {
    this.viewCount++;
  }
}