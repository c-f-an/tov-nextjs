import { IPostRepository, PostFilters, PaginationParams, PaginatedResult } from '@/core/domain/repositories/IPostRepository';
import { Post, PostStatus } from '@/core/domain/entities/Post';
import { query, queryOne } from '../database/mysql';
import { RowDataPacket } from 'mysql2';

interface PostRow extends RowDataPacket {
  id: number;
  category_id: number;
  user_id: number;
  title: string;
  slug: string | null;
  content: string;
  excerpt: string | null;
  featured_image: string | null;
  status: PostStatus;
  is_notice: boolean;
  is_featured: boolean;
  view_count: number;
  published_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

export class MySQLPostRepository implements IPostRepository {
  async findById(id: string): Promise<Post | null> {
    const row = await queryOne<PostRow>(
      'SELECT * FROM posts WHERE id = ?',
      [parseInt(id)]
    );
    
    return row ? this.mapToPost(row) : null;
  }

  async findBySlug(slug: string): Promise<Post | null> {
    const row = await queryOne<PostRow>(
      'SELECT * FROM posts WHERE slug = ?',
      [slug]
    );
    
    return row ? this.mapToPost(row) : null;
  }

  async findAll(filters: PostFilters, pagination: PaginationParams): Promise<PaginatedResult<Post>> {
    let whereConditions: string[] = [];
    let params: any[] = [];

    if (filters.status) {
      whereConditions.push('status = ?');
      params.push(filters.status);
    }

    if (filters.authorId) {
      whereConditions.push('user_id = ?');
      params.push(parseInt(filters.authorId));
    }

    if (filters.search) {
      whereConditions.push('(title LIKE ? OR content LIKE ?)');
      params.push(`%${filters.search}%`, `%${filters.search}%`);
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';
    
    // Get total count
    const countQuery = `SELECT COUNT(*) as total FROM posts ${whereClause}`;
    const [countResult] = await query<any>(countQuery, params);
    const total = countResult.total;

    // Get paginated results
    const offset = (pagination.page - 1) * pagination.limit;
    const dataQuery = `
      SELECT * FROM posts 
      ${whereClause}
      ORDER BY is_notice DESC, published_at DESC, created_at DESC
      LIMIT ? OFFSET ?
    `;
    const rows = await query<PostRow>(dataQuery, [...params, pagination.limit, offset]);

    return {
      data: rows.map(row => this.mapToPost(row)),
      total,
      page: pagination.page,
      totalPages: Math.ceil(total / pagination.limit)
    };
  }

  async save(post: Post): Promise<void> {
    await query(
      `INSERT INTO posts (category_id, user_id, title, slug, content, excerpt, featured_image, status, is_notice, is_featured, view_count, published_at, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        post.categoryId,
        post.userId,
        post.title,
        post.slug,
        post.content,
        post.excerpt,
        post.featuredImage,
        post.status,
        post.isNotice,
        post.isFeatured,
        post.viewCount,
        post.publishedAt
      ]
    );
  }

  async update(post: Post): Promise<void> {
    await query(
      `UPDATE posts 
       SET category_id = ?, user_id = ?, title = ?, slug = ?, content = ?, excerpt = ?, 
           featured_image = ?, status = ?, is_notice = ?, is_featured = ?, view_count = ?, 
           published_at = ?, updated_at = NOW()
       WHERE id = ?`,
      [
        post.categoryId,
        post.userId,
        post.title,
        post.slug,
        post.content,
        post.excerpt,
        post.featuredImage,
        post.status,
        post.isNotice,
        post.isFeatured,
        post.viewCount,
        post.publishedAt,
        post.id
      ]
    );
  }

  async delete(id: string): Promise<void> {
    await query('DELETE FROM posts WHERE id = ?', [parseInt(id)]);
  }

  async incrementViewCount(id: string): Promise<void> {
    await query(
      'UPDATE posts SET view_count = view_count + 1 WHERE id = ?',
      [parseInt(id)]
    );
  }

  private mapToPost(row: PostRow): Post {
    return new Post({
      id: row.id,
      categoryId: row.category_id,
      userId: row.user_id,
      title: row.title,
      slug: row.slug,
      content: row.content,
      excerpt: row.excerpt,
      featuredImage: row.featured_image,
      status: row.status,
      isNotice: row.is_notice,
      isFeatured: row.is_featured,
      viewCount: row.view_count,
      publishedAt: row.published_at,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    });
  }
}