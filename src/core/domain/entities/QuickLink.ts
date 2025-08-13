export class QuickLink {
  constructor(
    public readonly id: number,
    public title: string,
    public icon: string | null,
    public linkUrl: string,
    public description: string | null,
    public sortOrder: number,
    public isActive: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  static create(data: {
    title: string;
    icon?: string | null;
    linkUrl: string;
    description?: string | null;
    sortOrder?: number;
    isActive?: boolean;
  }): QuickLink {
    return new QuickLink(
      0,
      data.title,
      data.icon || null,
      data.linkUrl,
      data.description || null,
      data.sortOrder || 0,
      data.isActive !== undefined ? data.isActive : true,
      new Date(),
      new Date()
    );
  }

  updateContent(data: {
    title?: string;
    icon?: string | null;
    linkUrl?: string;
    description?: string | null;
  }): void {
    if (data.title !== undefined) this.title = data.title;
    if (data.icon !== undefined) this.icon = data.icon;
    if (data.linkUrl !== undefined) this.linkUrl = data.linkUrl;
    if (data.description !== undefined) this.description = data.description;
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

  toggleActive(): void {
    this.isActive = !this.isActive;
  }

  isExternal(): boolean {
    return this.linkUrl.startsWith('http://') || this.linkUrl.startsWith('https://');
  }
}