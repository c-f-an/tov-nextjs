import { ICategoryRepository } from '@/core/domain/repositories/ICategoryRepository';
import { Category, CategoryType } from '@/core/domain/entities/Category';
import { query, queryOne } from '../database/mysql';
import { RowDataPacket } from 'mysql2';

interface CategoryRow extends RowDataPacket {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  parent_id: number | null;
  type: CategoryType;
  sort_order: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export class MySQLCategoryRepository implements ICategoryRepository {
  async findById(id: number): Promise<Category | null> {
    const row = await queryOne<CategoryRow>(
      'SELECT * FROM categories WHERE id = ?',
      [id]
    );
    
    return row ? this.mapToCategory(row) : null;
  }

  async findBySlug(slug: string): Promise<Category | null> {
    const row = await queryOne<CategoryRow>(
      'SELECT * FROM categories WHERE slug = ?',
      [slug]
    );
    
    return row ? this.mapToCategory(row) : null;
  }

  async findAll(): Promise<Category[]> {
    const rows = await query<CategoryRow>(
      'SELECT * FROM categories ORDER BY sort_order ASC, name ASC'
    );
    
    return rows.map(row => this.mapToCategory(row));
  }

  async findByParentId(parentId: number | null): Promise<Category[]> {
    const rows = await query<CategoryRow>(
      parentId === null 
        ? 'SELECT * FROM categories WHERE parent_id IS NULL ORDER BY sort_order ASC, name ASC'
        : 'SELECT * FROM categories WHERE parent_id = ? ORDER BY sort_order ASC, name ASC',
      parentId === null ? [] : [parentId]
    );
    
    return rows.map(row => this.mapToCategory(row));
  }

  async save(category: Category): Promise<Category> {
    const result = await query<any>(
      `INSERT INTO categories (name, slug, description, parent_id, type, sort_order, is_active, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        category.name,
        category.slug,
        category.description,
        category.parentId,
        category.type,
        category.sortOrder,
        category.isActive
      ]
    );

    return new Category(
      (result as any).insertId,
      category.name,
      category.slug,
      category.description,
      category.parentId,
      category.type,
      category.sortOrder,
      category.isActive,
      new Date(),
      new Date()
    );
  }

  async update(id: number, category: Partial<Category>): Promise<Category | null> {
    const fields: string[] = [];
    const values: any[] = [];

    if (category.name !== undefined) {
      fields.push('name = ?');
      values.push(category.name);
    }
    if (category.slug !== undefined) {
      fields.push('slug = ?');
      values.push(category.slug);
    }
    if (category.description !== undefined) {
      fields.push('description = ?');
      values.push(category.description);
    }
    if (category.parentId !== undefined) {
      fields.push('parent_id = ?');
      values.push(category.parentId);
    }
    if (category.type !== undefined) {
      fields.push('type = ?');
      values.push(category.type);
    }
    if (category.sortOrder !== undefined) {
      fields.push('sort_order = ?');
      values.push(category.sortOrder);
    }
    if (category.isActive !== undefined) {
      fields.push('is_active = ?');
      values.push(category.isActive);
    }

    if (fields.length === 0) {
      return this.findById(id);
    }

    fields.push('updated_at = NOW()');
    values.push(id);

    await query(
      `UPDATE categories SET ${fields.join(', ')} WHERE id = ?`,
      values
    );

    return this.findById(id);
  }

  async delete(id: number): Promise<void> {
    await query('DELETE FROM categories WHERE id = ?', [id]);
  }

  private mapToCategory(row: CategoryRow): Category {
    return new Category(
      row.id,
      row.name,
      row.slug,
      row.description,
      row.parent_id,
      row.type,
      row.sort_order,
      row.is_active,
      row.created_at,
      row.updated_at
    );
  }
}