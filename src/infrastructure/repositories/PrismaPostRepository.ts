import { injectable } from 'tsyringe';
import { PrismaClient } from '@prisma/client';
import { Post, PostStatus } from '@/core/domain/entities/Post';
import { IPostRepository } from '@/core/domain/repositories/IPostRepository';
import { prisma } from '../database/prisma';

interface FindPaginatedOptions {
  categoryId?: number;
  offset: number;
  limit: number;
  includeNotices?: boolean;
}

@injectable()
export class PrismaPostRepository implements IPostRepository {
  private prisma: PrismaClient = prisma;

  async save(post: Post): Promise<Post> {
    const data = {
      category_id: post.categoryId,
      user_id: post.userId,
      title: post.title,
      content: post.content,
      status: post.status as string,
      view_count: post.viewCount,
      is_notice: post.isNotice,
      attachmentUrls: post.attachmentUrls
    };

    const saved = post.id
      ? await this.prisma.post.update({
          where: { id: post.id },
          data
        })
      : await this.prisma.post.create({ data });

    return this.mapToEntity(saved);
  }

  async findById(id: number): Promise<Post | null> {
    const post = await this.prisma.post.findUnique({
      where: { id }
    });

    return post ? this.mapToEntity(post) : null;
  }

  async findPaginated(options: FindPaginatedOptions): Promise<{ posts: Post[]; total: number }> {
    const where: any = {};

    if (options.categoryId) {
      where.category_id = options.categoryId;
    }

    if (!options.includeNotices) {
      where.is_notice = false;
    }

    const [posts, total] = await Promise.all([
      this.prisma.post.findMany({
        where,
        skip: options.offset,
        take: options.limit,
        orderBy: [
          { is_notice: 'desc' },
          { created_at: 'desc' }
        ]
      }),
      this.prisma.post.count({ where })
    ]);

    return {
      posts: posts.map(this.mapToEntity),
      total
    };
  }

  async findByCategory(categoryId: number, limit?: number): Promise<Post[]> {
    const posts = await this.prisma.post.findMany({
      where: { category_id: categoryId },
      take: limit,
      orderBy: [
        { is_notice: 'desc' },
        { created_at: 'desc' }
      ]
    });

    return posts.map(this.mapToEntity);
  }

  async incrementViewCount(id: number): Promise<void> {
    await this.prisma.post.update({
      where: { id },
      data: {
        view_count: { increment: 1 }
      }
    });
  }

  async delete(id: number): Promise<void> {
    await this.prisma.post.delete({
      where: { id }
    });
  }

  private mapToEntity(prismaPost: any): Post {
    return new Post({
      id: prismaPost.id,
      categoryId: prismaPost.category_id,
      userId: prismaPost.user_id,
      title: prismaPost.title,
      content: prismaPost.content,
      status: prismaPost.status as PostStatus,
      viewCount: prismaPost.view_count,
      isNotice: prismaPost.is_notice,
      attachmentUrls: prismaPost.attachmentUrls,
      createdAt: prismaPost.created_at,
      updatedAt: prismaPost.updated_at
    });
  }
}