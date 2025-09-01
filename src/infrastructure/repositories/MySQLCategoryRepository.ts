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
      result.insertId,
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