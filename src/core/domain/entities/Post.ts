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
  public readonly id: number;
  public readonly categoryId: number;
  public readonly userId: number;
  public readonly title: string;
  public readonly content: string;
  public readonly status: PostStatus;
  public readonly isNotice: boolean;
  public readonly isFeatured: boolean;
  public readonly viewCount: number;
  public readonly slug?: string | null;
  public readonly excerpt?: string | null;
  public readonly featuredImage?: string | null;
  public readonly publishedAt?: Date | null;
  public readonly createdAt?: Date | null;
  public readonly updatedAt?: Date | null;
  public readonly attachmentUrls: string[];

  constructor(data: IPost & { attachmentUrls?: string[] }) {
    this.id = data.id;
    this.categoryId = data.categoryId;
    this.userId = data.userId;
    this.title = data.title;
    this.content = data.content;
    this.status = data.status;
    this.isNotice = data.isNotice;
    this.isFeatured = data.isFeatured;
    this.viewCount = data.viewCount;
    this.slug = data.slug;
    this.excerpt = data.excerpt;
    this.featuredImage = data.featuredImage;
    this.publishedAt = data.publishedAt;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.attachmentUrls = data.attachmentUrls || [];
  }

  static create(params: Omit<IPost, 'id' | 'viewCount' | 'createdAt' | 'updatedAt' | 'publishedAt' | 'slug'>): Post {
    const now = new Date();
    const slug = params.title
      .toLowerCase()
      .replace(/[^a-z0-9가-힣ㄱ-ㅎㅏ-ㅣ\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
    
    return new Post({
      id: 0, // Auto-increment ID
      categoryId: params.categoryId,
      userId: params.userId,
      title: params.title,
      content: params.content,
      status: params.status,
      isNotice: params.isNotice || false,
      isFeatured: params.isFeatured || false,
      viewCount: 0,
      slug,
      excerpt: params.excerpt,
      featuredImage: params.featuredImage,
      publishedAt: params.status === PostStatus.published ? now : null,
      createdAt: now,
      updatedAt: now
    });
  }

  publish(): Post {
    return new Post({
      ...this,
      status: PostStatus.published,
      publishedAt: new Date(),
      updatedAt: new Date()
    });
  }

  incrementViewCount(): Post {
    return new Post({
      ...this,
      viewCount: this.viewCount + 1
    });
  }
}