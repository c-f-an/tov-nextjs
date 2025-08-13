export enum CategoryType {
  notice = 'notice',
  news = 'news',
  publication = 'publication',
  media = 'media',
  resource = 'resource',
  activity = 'activity'
}

export class Category {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly slug: string,
    public readonly description: string | null,
    public readonly parentId: number | null,
    public readonly type: CategoryType,
    public readonly sortOrder: number,
    public readonly isActive: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}
}