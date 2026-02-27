import { INewsletterSubscriberRepository } from '@/core/domain/repositories/INewsletterSubscriberRepository';
import { NewsletterSubscriber } from '@/core/domain/entities/NewsletterSubscriber';
import { query, queryOne } from '../database/mysql';
import { RowDataPacket } from 'mysql2';

interface NewsletterSubscriberRow extends RowDataPacket {
  id: number;
  email: string;
  name: string | null;
  is_active: boolean;
  subscribed_at: Date;
  unsubscribed_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

export class MySQLNewsletterSubscriberRepository implements INewsletterSubscriberRepository {
  async findById(id: number): Promise<NewsletterSubscriber | null> {
    const row = await queryOne<NewsletterSubscriberRow>(
      'SELECT * FROM newsletter_subscribers WHERE id = ?',
      [id]
    );
    
    return row ? this.mapToNewsletterSubscriber(row) : null;
  }

  async findByEmail(email: string): Promise<NewsletterSubscriber | null> {
    const row = await queryOne<NewsletterSubscriberRow>(
      'SELECT * FROM newsletter_subscribers WHERE email = ?',
      [email]
    );
    
    return row ? this.mapToNewsletterSubscriber(row) : null;
  }

  async findAll(onlyActive: boolean = true): Promise<NewsletterSubscriber[]> {
    const whereClause = onlyActive ? 'WHERE is_active = true' : '';
    const rows = await query<NewsletterSubscriberRow>(
      `SELECT * FROM newsletter_subscribers ${whereClause} ORDER BY subscribed_at DESC`
    );
    
    return rows.map(row => this.mapToNewsletterSubscriber(row));
  }

  async save(subscriber: NewsletterSubscriber): Promise<NewsletterSubscriber> {
    const result = await query<any>(
      `INSERT INTO newsletter_subscribers (email, name, is_active, subscribed_at, unsubscribed_at, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        subscriber.email,
        subscriber.name,
        subscriber.isActive,
        subscriber.subscribedAt,
        subscriber.unsubscribedAt
      ]
    );
    
    return new NewsletterSubscriber(
      (result as any).insertId,
      subscriber.email,
      subscriber.name,
      subscriber.isActive,
      subscriber.subscribedAt,
      subscriber.unsubscribedAt,
      new Date(),
      new Date()
    );
  }

  async update(subscriber: NewsletterSubscriber): Promise<void> {
    await query(
      `UPDATE newsletter_subscribers 
       SET email = ?, name = ?, is_active = ?, subscribed_at = ?, unsubscribed_at = ?, updated_at = NOW()
       WHERE id = ?`,
      [
        subscriber.email,
        subscriber.name,
        subscriber.isActive,
        subscriber.subscribedAt,
        subscriber.unsubscribedAt,
        subscriber.id
      ]
    );
  }

  async delete(id: number): Promise<void> {
    await query('DELETE FROM newsletter_subscribers WHERE id = ?', [id]);
  }

  async countActive(): Promise<number> {
    const [result] = await query<any>(
      'SELECT COUNT(*) as count FROM newsletter_subscribers WHERE is_active = true'
    );
    return result.count;
  }

  async getRecentSubscribers(days: number): Promise<NewsletterSubscriber[]> {
    const date = new Date();
    date.setDate(date.getDate() - days);
    
    const rows = await query<NewsletterSubscriberRow>(
      'SELECT * FROM newsletter_subscribers WHERE subscribed_at >= ? ORDER BY subscribed_at DESC',
      [date]
    );
    
    return rows.map(row => this.mapToNewsletterSubscriber(row));
  }

  private mapToNewsletterSubscriber(row: NewsletterSubscriberRow): NewsletterSubscriber {
    return new NewsletterSubscriber(
      row.id,
      row.email,
      row.name,
      row.is_active,
      row.subscribed_at,
      row.unsubscribed_at,
      row.created_at,
      row.updated_at
    );
  }
}