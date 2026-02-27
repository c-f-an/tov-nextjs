import { IFAQRepository } from '@/core/domain/repositories/IFAQRepository';
import { FAQ } from '@/core/domain/entities/FAQ';
import { query, queryOne } from '../database/mysql';
import { RowDataPacket } from 'mysql2';

interface FAQRow extends RowDataPacket {
  id: number;
  category: string;
  question: string;
  answer: string;
  sort_order: number;
  is_active: boolean;
  view_count: number;
  created_at: Date;
  updated_at: Date;
}

export class MySQLFAQRepository implements IFAQRepository {
  async findById(id: number): Promise<FAQ | null> {
    const row = await queryOne<FAQRow>(
      'SELECT * FROM faqs WHERE id = ?',
      [id]
    );
    
    return row ? this.mapToFAQ(row) : null;
  }

  async findByCategory(category: string): Promise<FAQ[]> {
    const rows = await query<FAQRow>(
      'SELECT * FROM faqs WHERE category = ? AND is_active = true ORDER BY sort_order ASC, created_at DESC',
      [category]
    );
    
    return rows.map(row => this.mapToFAQ(row));
  }

  async findAll(onlyActive: boolean = true): Promise<FAQ[]> {
    const whereClause = onlyActive ? 'WHERE is_active = true' : '';
    const rows = await query<FAQRow>(
      `SELECT * FROM faqs ${whereClause} ORDER BY category, sort_order ASC, created_at DESC`
    );
    
    return rows.map(row => this.mapToFAQ(row));
  }

  async getCategories(): Promise<string[]> {
    const rows = await query<any>(
      'SELECT DISTINCT category FROM faqs WHERE is_active = true ORDER BY category'
    );
    
    return rows.map(row => row.category);
  }

  async save(faq: FAQ): Promise<FAQ> {
    const result = await query<any>(
      `INSERT INTO faqs (category, question, answer, sort_order, is_active, view_count, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        faq.category,
        faq.question,
        faq.answer,
        faq.sortOrder,
        faq.isActive,
        faq.viewCount
      ]
    );
    
    return new FAQ(
      (result as any).insertId,
      faq.category,
      faq.question,
      faq.answer,
      faq.sortOrder,
      faq.isActive,
      faq.viewCount,
      new Date(),
      new Date()
    );
  }

  async update(faq: FAQ): Promise<void> {
    await query(
      `UPDATE faqs 
       SET category = ?, question = ?, answer = ?, sort_order = ?, is_active = ?, view_count = ?, updated_at = NOW()
       WHERE id = ?`,
      [
        faq.category,
        faq.question,
        faq.answer,
        faq.sortOrder,
        faq.isActive,
        faq.viewCount,
        faq.id
      ]
    );
  }

  async delete(id: number): Promise<void> {
    await query('DELETE FROM faqs WHERE id = ?', [id]);
  }

  async search(searchQuery: string): Promise<FAQ[]> {
    const rows = await query<FAQRow>(
      `SELECT * FROM faqs 
       WHERE is_active = true AND (question LIKE ? OR answer LIKE ?)
       ORDER BY category, sort_order ASC, created_at DESC`,
      [`%${searchQuery}%`, `%${searchQuery}%`]
    );
    
    return rows.map(row => this.mapToFAQ(row));
  }

  private mapToFAQ(row: FAQRow): FAQ {
    return new FAQ(
      row.id,
      row.category,
      row.question,
      row.answer,
      row.sort_order,
      row.is_active,
      row.view_count,
      row.created_at,
      row.updated_at
    );
  }
}