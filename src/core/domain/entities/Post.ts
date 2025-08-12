export enum PostStatus {
  draft = 'draft',
  published = 'published',
  archived = 'archived'
}

export interface IPost {
  id: number;
  categoryId: number;
  userId: number;
  title: string;
  slug?: string | null;
  content: string;
  excerpt?: string | null;
  featuredImage?: string | null;
  status: PostStatus;
  isNotice: boolean;
  isFeatured: boolean;
  viewCount: number;
  publishedAt?: Date | null;
  createdAt?: Date | null;
  updatedAt?: Date | null;
}

export class Post implements IPost {
  constructor(
    public readonly id: number,
    public readonly categoryId: number,
    public readonly userId: number,
    public readonly title: string,
    public readonly content: string,
    public readonly status: PostStatus,
    public readonly isNotice: boolean,
    public readonly isFeatured: boolean,
    public readonly viewCount: number,
    public readonly slug?: string | null,
    public readonly excerpt?: string | null,
    public readonly featuredImage?: string | null,
    public readonly publishedAt?: Date | null,
    public readonly createdAt?: Date | null,
    public readonly updatedAt?: Date | null
  ) {}

  static create(params: Omit<IPost, 'id' | 'viewCount' | 'createdAt' | 'updatedAt' | 'publishedAt' | 'slug'>): Post {
    const now = new Date();
    const slug = params.title
      .toLowerCase()
      .replace(/[^a-z0-9가-힣ㄱ-ㅎㅏ-ㅣ\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
    
    return new Post(
      0, // Auto-increment ID
      params.categoryId,
      params.userId,
      params.title,
      params.content,
      params.status,
      params.isNotice || false,
      params.isFeatured || false,
      0,
      slug,
      params.excerpt,
      params.featuredImage,
      params.status === PostStatus.published ? now : null,
      now,
      now
    );
  }

  publish(): Post {
    return new Post(
      this.id,
      this.categoryId,
      this.userId,
      this.title,
      this.content,
      PostStatus.published,
      this.isNotice,
      this.isFeatured,
      this.viewCount,
      this.slug,
      this.excerpt,
      this.featuredImage,
      new Date(),
      this.createdAt,
      new Date()
    );
  }

  incrementViewCount(): Post {
    return new Post(
      this.id,
      this.categoryId,
      this.userId,
      this.title,
      this.content,
      this.status,
      this.isNotice,
      this.isFeatured,
      this.viewCount + 1,
      this.slug,
      this.excerpt,
      this.featuredImage,
      this.publishedAt,
      this.createdAt,
      this.updatedAt
    );
  }
}