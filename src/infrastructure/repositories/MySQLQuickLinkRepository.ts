import { IQuickLinkRepository } from '@/core/domain/repositories/IQuickLinkRepository';
import { QuickLink } from '@/core/domain/entities/QuickLink';
import { query, queryOne } from '../database/mysql';
import { RowDataPacket } from 'mysql2';

interface QuickLinkRow extends RowDataPacket {
  id: number;
  title: string;
  icon: string | null;
  link_url: string;
  description: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export class MySQLQuickLinkRepository implements IQuickLinkRepository {
  async findById(id: number): Promise<QuickLink | null> {
    const row = await queryOne<QuickLinkRow>(
      'SELECT * FROM quick_links WHERE id = ?',
      [id]
    );
    
    return row ? this.mapToQuickLink(row) : null;
  }

  async findAll(onlyActive: boolean = true): Promise<QuickLink[]> {
    const whereClause = onlyActive ? 'WHERE is_active = true' : '';
    const rows = await query<QuickLinkRow>(
      `SELECT * FROM quick_links ${whereClause} ORDER BY sort_order ASC, created_at DESC`
    );
    
    return rows.map(row => this.mapToQuickLink(row));
  }

  async findActive(): Promise<QuickLink[]> {
    return this.findAll(true);
  }

  async save(quickLink: QuickLink): Promise<QuickLink> {
    const result = await query<any>(
      `INSERT INTO quick_links (title, icon, link_url, description, sort_order, is_active, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        quickLink.title,
        quickLink.icon,
        quickLink.linkUrl,
        quickLink.description,
        quickLink.sortOrder,
        quickLink.isActive
      ]
    );
    
    return new QuickLink(
      (result as any).insertId,
      quickLink.title,
      quickLink.icon,
      quickLink.linkUrl,
      quickLink.description,
      quickLink.sortOrder,
      quickLink.isActive,
      new Date(),
      new Date()
    );
  }

  async update(quickLink: QuickLink): Promise<void> {
    await query(
      `UPDATE quick_links 
       SET title = ?, icon = ?, link_url = ?, description = ?, sort_order = ?, is_active = ?, updated_at = NOW()
       WHERE id = ?`,
      [
        quickLink.title,
        quickLink.icon,
        quickLink.linkUrl,
        quickLink.description,
        quickLink.sortOrder,
        quickLink.isActive,
        quickLink.id
      ]
    );
  }

  async delete(id: number): Promise<void> {
    await query('DELETE FROM quick_links WHERE id = ?', [id]);
  }

  private mapToQuickLink(row: QuickLinkRow): QuickLink {
    return new QuickLink(
      row.id,
      row.title,
      row.icon,
      row.link_url,
      row.description,
      row.sort_order,
      row.is_active,
      row.created_at,
      row.updated_at
    );
  }
}