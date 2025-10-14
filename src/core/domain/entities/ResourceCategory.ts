export class ResourceCategory {
  constructor(
    public readonly id: number,
    public name: string,
    public slug: string,
    public description: string | null,
    public icon: string | null,
    public sortOrder: number,
    public isActive: boolean,
    public readonly createdAt: Date,
    public updatedAt: Date
  ) {}

  static create(
    name: string,
    slug: string,
    description: string | null = null,
    icon: string | null = null,
    sortOrder: number = 0,
    isActive: boolean = true
  ): ResourceCategory {
    const now = new Date();
    return new ResourceCategory(
      0, // ID will be assigned by database
      name,
      slug,
      description,
      icon,
      sortOrder,
      isActive,
      now,
      now
    );
  }

  update(data: Partial<{
    name: string;
    slug: string;
    description: string | null;
    icon: string | null;
    sortOrder: number;
    isActive: boolean;
  }>): void {
    if (data.name !== undefined) this.name = data.name;
    if (data.slug !== undefined) this.slug = data.slug;
    if (data.description !== undefined) this.description = data.description;
    if (data.icon !== undefined) this.icon = data.icon;
    if (data.sortOrder !== undefined) this.sortOrder = data.sortOrder;
    if (data.isActive !== undefined) this.isActive = data.isActive;
    this.updatedAt = new Date();
  }

  activate(): void {
    this.isActive = true;
    this.updatedAt = new Date();
  }

  deactivate(): void {
    this.isActive = false;
    this.updatedAt = new Date();
  }
}