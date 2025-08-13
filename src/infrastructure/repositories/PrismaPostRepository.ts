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
      categoryId: post.categoryId,
      userId: post.userId,
      title: post.title,
      content: post.content,
      status: post.status as string,
      viewCount: post.viewCount,
      isNotice: post.isNotice,
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
      where.categoryId = options.categoryId;
    }

    if (!options.includeNotices) {
      where.isNotice = false;
    }

    const [posts, total] = await Promise.all([
      this.prisma.post.findMany({
        where,
        skip: options.offset,
        take: options.limit,
        orderBy: [
          { isNotice: 'desc' },
          { createdAt: 'desc' }
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
      where: { categoryId },
      take: limit,
      orderBy: [
        { isNotice: 'desc' },
        { createdAt: 'desc' }
      ]
    });

    return posts.map(this.mapToEntity);
  }

  async incrementViewCount(id: number): Promise<void> {
    await this.prisma.post.update({
      where: { id },
      data: {
        viewCount: { increment: 1 }
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
      categoryId: prismaPost.categoryId,
      userId: prismaPost.userId,
      title: prismaPost.title,
      content: prismaPost.content,
      status: prismaPost.status as PostStatus,
      viewCount: prismaPost.viewCount,
      isNotice: prismaPost.isNotice,
      attachmentUrls: prismaPost.attachmentUrls,
      createdAt: prismaPost.createdAt,
      updatedAt: prismaPost.updatedAt
    });
  }
}