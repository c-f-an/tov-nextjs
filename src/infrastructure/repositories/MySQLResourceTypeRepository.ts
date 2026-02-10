import { IResourceTypeRepository } from '@/core/domain/repositories/IResourceTypeRepository';
import { ResourceType } from '@/core/domain/entities/ResourceType';
import { pool } from '@/infrastructure/database/mysql';

export class MySQLResourceTypeRepository implements IResourceTypeRepository {

  async findAll(): Promise<ResourceType[]> {
    const [rows] = await pool.query(
      'SELECT * FROM resource_types ORDER BY sort_order ASC, name ASC'
    );
    return (rows as any[]).map(row => this.mapRowToEntity(row));
  }

  async findById(id: number): Promise<ResourceType | null> {
    const [rows] = await pool.execute(
      'SELECT * FROM resource_types WHERE id = ?',
      [id]
    );
    const row = (rows as any[])[0];
    return row ? this.mapRowToEntity(row) : null;
  }

  async findByCode(code: string): Promise<ResourceType | null> {
    const [rows] = await pool.execute(
      'SELECT * FROM resource_types WHERE code = ?',
      [code]
    );
    const row = (rows as any[])[0];
    return row ? this.mapRowToEntity(row) : null;
  }

  async findByCodes(codes: string[]): Promise<ResourceType[]> {
    if (codes.length === 0) return [];

    const placeholders = codes.map(() => '?').join(',');
    const [rows] = await pool.execute(
      `SELECT * FROM resource_types WHERE code IN (${placeholders}) ORDER BY sort_order ASC`,
      codes
    );
    return (rows as any[]).map(row => this.mapRowToEntity(row));
  }

  async findByResourceId(resourceId: number): Promise<ResourceType[]> {
    const [rows] = await pool.execute(
      `SELECT rt.* FROM resource_types rt
       INNER JOIN resource_type_map rtm ON rt.id = rtm.type_id
       WHERE rtm.resource_id = ?
       ORDER BY rt.sort_order ASC`,
      [resourceId]
    );
    return (rows as any[]).map(row => this.mapRowToEntity(row));
  }

  async create(type: ResourceType): Promise<ResourceType> {
    const [result] = await pool.execute(
      'INSERT INTO resource_types (name, code, sort_order) VALUES (?, ?, ?)',
      [type.name, type.code, type.sortOrder]
    );
    const insertId = (result as any).insertId;
    const created = await this.findById(insertId);
    if (!created) throw new Error('Failed to create resource type');
    return created;
  }

  async update(type: ResourceType): Promise<ResourceType> {
    await pool.execute(
      'UPDATE resource_types SET name = ?, code = ?, sort_order = ? WHERE id = ?',
      [type.name, type.code, type.sortOrder, type.id]
    );
    const updated = await this.findById(type.id);
    if (!updated) throw new Error('Failed to update resource type');
    return updated;
  }

  async delete(id: number): Promise<void> {
    await pool.execute('DELETE FROM resource_types WHERE id = ?', [id]);
  }

  // Pivot table operations
  async setResourceTypes(resourceId: number, typeIds: number[]): Promise<void> {
    // Clear existing mappings
    await this.clearResourceTypes(resourceId);

    // Insert new mappings
    if (typeIds.length > 0) {
      const values = typeIds.map(typeId => `(${resourceId}, ${typeId})`).join(', ');
      await pool.query(
        `INSERT INTO resource_type_map (resource_id, type_id) VALUES ${values}`
      );
    }
  }

  async addResourceType(resourceId: number, typeId: number): Promise<void> {
    await pool.execute(
      'INSERT IGNORE INTO resource_type_map (resource_id, type_id) VALUES (?, ?)',
      [resourceId, typeId]
    );
  }

  async removeResourceType(resourceId: number, typeId: number): Promise<void> {
    await pool.execute(
      'DELETE FROM resource_type_map WHERE resource_id = ? AND type_id = ?',
      [resourceId, typeId]
    );
  }

  async clearResourceTypes(resourceId: number): Promise<void> {
    await pool.execute(
      'DELETE FROM resource_type_map WHERE resource_id = ?',
      [resourceId]
    );
  }

  private mapRowToEntity(row: any): ResourceType {
    return new ResourceType(
      row.id,
      row.name,
      row.code,
      row.sort_order
    );
  }
}
