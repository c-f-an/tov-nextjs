import { INewsRepository } from '@/core/domain/repositories/INewsRepository';
import { News, NewsCreateInput, NewsUpdateInput, NewsListParams, NewsListResponse } from '@/core/domain/entities/News';
import { query } from '../database/mysql';
import { RowDataPacket } from 'mysql2';

interface NewsRow extends RowDataPacket {
  id: number;
  title: string;
  content: string;
  summary: string;
  category: string;
  image_url: string | null;
  author: string;
  views: number;
  is_published: number;
  published_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

export class MySQLNewsRepository implements INewsRepository {
  private static instance: MySQLNewsRepository;

  private constructor() {}

  public static getInstance(): MySQLNewsRepository {
    if (!MySQLNewsRepository.instance) {
      MySQLNewsRepository.instance = new MySQLNewsRepository();
    }
    return MySQLNewsRepository.instance;
  }
  private mapRowToNews(row: NewsRow): News {
    return {
      id: row.id,
      title: row.title,
      content: row.content,
      summary: row.summary,
      category: row.category as News['category'],
      imageUrl: row.image_url || undefined,
      author: row.author,
      views: row.views,
      isPublished: Boolean(row.is_published),
      publishedAt: row.published_at || undefined,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  async create(input: NewsCreateInput): Promise<News> {
    const sql = `
      INSERT INTO news (title, content, summary, category, image_url, author, is_published, published_at, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `;
    
    const params = [
      input.title,
      input.content,
      input.summary,
      input.category,
      input.imageUrl || null,
      input.author,
      input.isPublished ? 1 : 0,
      input.publishedAt || null,
    ];

    const result = await query<any>(sql, params);
    return this.findById(result[0].insertId) as Promise<News>;
  }

  async update(id: number, input: NewsUpdateInput): Promise<News> {
    const updates: string[] = [];
    const params: any[] = [];

    if (input.title !== undefined) {
      updates.push('title = ?');
      params.push(input.title);
    }
    if (input.content !== undefined) {
      updates.push('content = ?');
      params.push(input.content);
    }
    if (input.summary !== undefined) {
      updates.push('summary = ?');
      params.push(input.summary);
    }
    if (input.category !== undefined) {
      updates.push('category = ?');
      params.push(input.category);
    }
    if (input.imageUrl !== undefined) {
      updates.push('image_url = ?');
      params.push(input.imageUrl || null);
    }
    if (input.author !== undefined) {
      updates.push('author = ?');
      params.push(input.author);
    }
    if (input.isPublished !== undefined) {
      updates.push('is_published = ?');
      params.push(input.isPublished ? 1 : 0);
    }
    if (input.publishedAt !== undefined) {
      updates.push('published_at = ?');
      params.push(input.publishedAt || null);
    }

    updates.push('updated_at = NOW()');
    params.push(id);

    const sql = `UPDATE news SET ${updates.join(', ')} WHERE id = ?`;
    await query(sql, params);

    return this.findById(id) as Promise<News>;
  }

  async delete(id: number): Promise<void> {
    await query('DELETE FROM news WHERE id = ?', [id]);
  }

  async findById(id: number): Promise<News | null> {
    const rows = await query<NewsRow>('SELECT * FROM news WHERE id = ?', [id]);
    if (rows.length === 0) return null;
    return this.mapRowToNews(rows[0]);
  }

  async findAll(params: NewsListParams): Promise<NewsListResponse> {
    const page = params.page || 1;
    const limit = params.limit || 12;
    const offset = (page - 1) * limit;

    let whereConditions: string[] = [];
    let queryParams: any[] = [];

    if (params.category) {
      whereConditions.push('category = ?');
      queryParams.push(params.category);
    }

    if (params.isPublished !== undefined) {
      whereConditions.push('is_published = ?');
      queryParams.push(params.isPublished ? 1 : 0);
    }

    if (params.searchTerm) {
      whereConditions.push('(title LIKE ? OR content LIKE ?)');
      queryParams.push(`%${params.searchTerm}%`, `%${params.searchTerm}%`);
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    const orderBy = params.sortBy === 'popular' ? 'views DESC' : 'published_at DESC';

    // Count total items
    const countSql = `SELECT COUNT(*) as total FROM news ${whereClause}`;
    const countResult = await query<any>(countSql, queryParams);
    const total = countResult[0].total;

    // Get paginated items
    const sql = `
      SELECT * FROM news
      ${whereClause}
      ORDER BY ${orderBy}
      LIMIT ? OFFSET ?
    `;

    const rows = await query<NewsRow>(sql, [...queryParams, limit, offset]);
    const items = rows.map(row => this.mapRowToNews(row));

    return {
      items,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async incrementViews(id: number): Promise<void> {
    await query('UPDATE news SET views = views + 1 WHERE id = ?', [id]);
  }
}