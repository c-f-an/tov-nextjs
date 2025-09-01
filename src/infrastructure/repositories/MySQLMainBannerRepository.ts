import { IMainBannerRepository } from '@/core/domain/repositories/IMainBannerRepository';
import { MainBanner, LinkTarget } from '@/core/domain/entities/MainBanner';
import { query, queryOne } from '../database/mysql';
import { RowDataPacket } from 'mysql2';

interface MainBannerRow extends RowDataPacket {
  id: number;
  title: string;
  subtitle: string | null;
  description: string | null;
  image_path: string;
  link_url: string | null;
  link_target: LinkTarget;
  sort_order: number;
  is_active: boolean;
  start_date: Date | null;
  end_date: Date | null;
  created_at: Date;
  updated_at: Date;
}

export class MySQLMainBannerRepository implements IMainBannerRepository {
  async findById(id: number): Promise<MainBanner | null> {
    const row = await queryOne<MainBannerRow>(
      'SELECT * FROM main_banners WHERE id = ?',
      [id]
    );
    
    return row ? this.mapToMainBanner(row) : null;
  }

  async findAll(onlyActive: boolean = true): Promise<MainBanner[]> {
    let whereConditions: string[] = [];
    
    if (onlyActive) {
      whereConditions.push('is_active = true');
    }
    
    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';
    const rows = await query<MainBannerRow>(
      `SELECT * FROM main_banners ${whereClause} ORDER BY sort_order ASC, created_at DESC`
    );
    
    return rows.map(row => this.mapToMainBanner(row));
  }

  async findActive(): Promise<MainBanner[]> {
    const now = new Date();
    const rows = await query<MainBannerRow>(
      `SELECT * FROM main_banners 
       WHERE is_active = true 
       AND (start_date IS NULL OR start_date <= ?)
       AND (end_date IS NULL OR end_date >= ?)
       ORDER BY sort_order ASC, created_at DESC`,
      [now, now]
    );
    
    return rows.map(row => this.mapToMainBanner(row));
  }

  async save(banner: MainBanner): Promise<MainBanner> {
    const result = await query<any>(
      `INSERT INTO main_banners (title, subtitle, description, image_path, link_url, link_target, sort_order, is_active, start_date, end_date, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        banner.title,
        banner.subtitle,
        banner.description,
        banner.imagePath,
        banner.linkUrl,
        banner.linkTarget,
        banner.sortOrder,
        banner.isActive,
        banner.startDate,
        banner.endDate
      ]
    );
    
    return new MainBanner(
      result.insertId,
      banner.title,
      banner.subtitle,
      banner.description,
      banner.imagePath,
      banner.linkUrl,
      banner.linkTarget,
      banner.sortOrder,
      banner.isActive,
      banner.startDate,
      banner.endDate,
      new Date(),
      new Date()
    );
  }

  async update(banner: MainBanner): Promise<void> {
    await query(
      `UPDATE main_banners 
       SET title = ?, subtitle = ?, description = ?, image_path = ?, link_url = ?, 
           link_target = ?, sort_order = ?, is_active = ?, start_date = ?, end_date = ?, 
           updated_at = NOW()
       WHERE id = ?`,
      [
        banner.title,
        banner.subtitle,
        banner.description,
        banner.imagePath,
        banner.linkUrl,
        banner.linkTarget,
        banner.sortOrder,
        banner.isActive,
        banner.startDate,
        banner.endDate,
        banner.id
      ]
    );
  }

  async delete(id: number): Promise<void> {
    await query('DELETE FROM main_banners WHERE id = ?', [id]);
  }

  private mapToMainBanner(row: MainBannerRow): MainBanner {
    return new MainBanner(
      row.id,
      row.title,
      row.subtitle,
      row.description,
      row.image_path,
      row.link_url,
      row.link_target,
      row.sort_order,
      row.is_active,
      row.start_date,
      row.end_date,
      row.created_at,
      row.updated_at
    );
  }
}