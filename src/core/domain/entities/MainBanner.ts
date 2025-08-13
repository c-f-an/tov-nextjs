export type LinkTarget = '_self' | '_blank';

export class MainBanner {
  constructor(
    public readonly id: number,
    public title: string,
    public subtitle: string | null,
    public description: string | null,
    public imagePath: string,
    public linkUrl: string | null,
    public linkTarget: LinkTarget,
    public sortOrder: number,
    public isActive: boolean,
    public startDate: Date | null,
    public endDate: Date | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  static create(data: {
    title: string;
    subtitle?: string | null;
    description?: string | null;
    imagePath: string;
    linkUrl?: string | null;
    linkTarget?: LinkTarget;
    sortOrder?: number;
    isActive?: boolean;
    startDate?: Date | null;
    endDate?: Date | null;
  }): MainBanner {
    return new MainBanner(
      0,
      data.title,
      data.subtitle || null,
      data.description || null,
      data.imagePath,
      data.linkUrl || null,
      data.linkTarget || '_self',
      data.sortOrder || 0,
      data.isActive !== undefined ? data.isActive : true,
      data.startDate || null,
      data.endDate || null,
      new Date(),
      new Date()
    );
  }

  updateContent(data: {
    title?: string;
    subtitle?: string | null;
    description?: string | null;
    imagePath?: string;
    linkUrl?: string | null;
    linkTarget?: LinkTarget;
  }): void {
    if (data.title !== undefined) this.title = data.title;
    if (data.subtitle !== undefined) this.subtitle = data.subtitle;
    if (data.description !== undefined) this.description = data.description;
    if (data.imagePath !== undefined) this.imagePath = data.imagePath;
    if (data.linkUrl !== undefined) this.linkUrl = data.linkUrl;
    if (data.linkTarget !== undefined) this.linkTarget = data.linkTarget;
  }

  updateSchedule(startDate: Date | null, endDate: Date | null): void {
    this.startDate = startDate;
    this.endDate = endDate;
  }

  updateSortOrder(sortOrder: number): void {
    this.sortOrder = sortOrder;
  }

  activate(): void {
    this.isActive = true;
  }

  deactivate(): void {
    this.isActive = false;
  }

  isCurrentlyActive(): boolean {
    if (!this.isActive) return false;

    const now = new Date();
    
    if (this.startDate && now < this.startDate) return false;
    if (this.endDate && now > this.endDate) return false;
    
    return true;
  }
}