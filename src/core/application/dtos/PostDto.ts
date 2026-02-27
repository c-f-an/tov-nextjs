import { Post, PostStatus } from '@/core/domain/entities/Post';
import { UserDto } from './UserDto';
import { CategoryDto } from './CategoryDto';

export class PostDto {
  id: number;
  categoryId: number;
  userId: number;
  title: string;
  content: string;
  status: PostStatus;
  viewCount: number;
  isNotice: boolean;
  attachmentUrls: string[];
  createdAt: Date | null;
  updatedAt: Date | null;
  category?: CategoryDto;
  user?: UserDto;

  constructor(data: PostDto) {
    this.id = data.id;
    this.categoryId = data.categoryId;
    this.userId = data.userId;
    this.title = data.title;
    this.content = data.content;
    this.status = data.status;
    this.viewCount = data.viewCount;
    this.isNotice = data.isNotice;
    this.attachmentUrls = data.attachmentUrls;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.category = data.category;
    this.user = data.user;
  }

  static fromEntity(post: Post, includeRelations?: { category?: CategoryDto; user?: UserDto }): PostDto {
    return new PostDto({
      id: post.id,
      categoryId: post.categoryId,
      userId: post.userId,
      title: post.title,
      content: post.content,
      status: post.status,
      viewCount: post.viewCount,
      isNotice: post.isNotice,
      attachmentUrls: post.attachmentUrls,
      createdAt: post.createdAt ?? null,
      updatedAt: post.updatedAt ?? null,
      category: includeRelations?.category,
      user: includeRelations?.user
    });
  }
}