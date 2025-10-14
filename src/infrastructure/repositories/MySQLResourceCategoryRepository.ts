import { IResourceCategoryRepository } from '@/core/domain/repositories/IResourceCategoryRepository';
import { ResourceCategory } from '@/core/domain/entities/ResourceCategory';
import { pool } from '@/infrastructure/database/mysql';

export class MySQLResourceCategoryRepository implements IResourceCategoryRepository {

  async findAll(): Promise<ResourceCategory[]> {
    const [rows] = await pool.execute(
      'SELECT * FROM resource_categories ORDER BY sort_order ASC'
    );
    return (rows as any[]).map(row => this.mapRowToEntity(row));
  }

  async findActive(): Promise<ResourceCategory[]> {
    const [rows] = await pool.execute(
      'SELECT * FROM resource_categories WHERE is_active = 1 ORDER BY sort_order ASC'
    );
    return (rows as any[]).map(row => this.mapRowToEntity(row));
  }

  async findById(id: number): Promise<ResourceCategory | null> {
    const [rows] = await pool.execute(
      'SELECT * FROM resource_categories WHERE id = ?',
      [id]
    );
    const row = (rows as any[])[0];
    return row ? this.mapRowToEntity(row) : null;
  }

  async findBySlug(slug: string): Promise<ResourceCategory | null> {
    const [rows] = await pool.execute(
      'SELECT * FROM resource_categories WHERE slug = ?',
      [slug]
    );
    const row = (rows as any[])[0];
    return row ? this.mapRowToEntity(row) : null;
  }

  async create(category: ResourceCategory): Promise<ResourceCategory> {
    const [result] = await pool.execute(
      `INSERT INTO resource_categories
       (name, slug, description, icon, sort_order, is_active, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        category.name,
        category.slug,
        category.description,
        category.icon,
        category.sortOrder,
        category.isActive ? 1 : 0
      ]
    );
    const insertId = (result as any).insertId;
    const created = await this.findById(insertId);
    if (!created) throw new Error('Failed to create resource category');
    return created;
  }

  async update(category: ResourceCategory): Promise<ResourceCategory> {
    await pool.execute(
      `UPDATE resource_categories
       SET name = ?, slug = ?, description = ?, icon = ?,
           sort_order = ?, is_active = ?, updated_at = NOW()
       WHERE id = ?`,
      [
        category.name,
        category.slug,
        category.description,
        category.icon,
        category.sortOrder,
        category.isActive ? 1 : 0,
        category.id
      ]
    );
    const updated = await this.findById(category.id);
    if (!updated) throw new Error('Failed to update resource category');
    return updated;
  }

  async delete(id: number): Promise<void> {
    await pool.execute('DELETE FROM resource_categories WHERE id = ?', [id]);
  }

  private mapRowToEntity(row: any): ResourceCategory {
    return new ResourceCategory(
      row.id,
      row.name,
      row.slug,
      row.description,
      row.icon,
      row.sort_order,
      Boolean(row.is_active),
      new Date(row.created_at),
      new Date(row.updated_at)
    );
  }
}