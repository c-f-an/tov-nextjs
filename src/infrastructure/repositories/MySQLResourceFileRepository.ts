import { IResourceFileRepository } from '@/core/domain/repositories/IResourceFileRepository';
import { ResourceFile } from '@/core/domain/entities/ResourceFile';
import { pool } from '@/infrastructure/database/mysql';

export class MySQLResourceFileRepository implements IResourceFileRepository {

  async findById(id: number): Promise<ResourceFile | null> {
    const [rows] = await pool.execute(
      'SELECT * FROM resource_files WHERE id = ?',
      [id]
    );
    const row = (rows as any[])[0];
    return row ? this.mapRowToEntity(row) : null;
  }

  async findByResourceId(resourceId: number): Promise<ResourceFile[]> {
    const [rows] = await pool.execute(
      'SELECT * FROM resource_files WHERE resource_id = ? ORDER BY sort_order ASC, created_at ASC',
      [resourceId]
    );
    return (rows as any[]).map(row => this.mapRowToEntity(row));
  }

  async create(file: ResourceFile): Promise<ResourceFile> {
    const [result] = await pool.execute(
      `INSERT INTO resource_files
       (resource_id, file_path, original_filename, file_type, file_size, sort_order, download_count, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        file.resourceId,
        file.filePath,
        file.originalFilename,
        file.fileType,
        file.fileSize,
        file.sortOrder,
        file.downloadCount
      ]
    );
    const insertId = (result as any).insertId;
    const created = await this.findById(insertId);
    if (!created) throw new Error('Failed to create resource file');
    return created;
  }

  async update(file: ResourceFile): Promise<ResourceFile> {
    await pool.execute(
      `UPDATE resource_files
       SET resource_id = ?, file_path = ?, original_filename = ?, file_type = ?,
           file_size = ?, sort_order = ?
       WHERE id = ?`,
      [
        file.resourceId,
        file.filePath,
        file.originalFilename,
        file.fileType,
        file.fileSize,
        file.sortOrder,
        file.id
      ]
    );
    const updated = await this.findById(file.id);
    if (!updated) throw new Error('Failed to update resource file');
    return updated;
  }

  async delete(id: number): Promise<void> {
    await pool.execute('DELETE FROM resource_files WHERE id = ?', [id]);
  }

  async deleteByResourceId(resourceId: number): Promise<void> {
    await pool.execute('DELETE FROM resource_files WHERE resource_id = ?', [resourceId]);
  }

  async incrementDownloadCount(id: number): Promise<void> {
    await pool.execute(
      'UPDATE resource_files SET download_count = download_count + 1 WHERE id = ?',
      [id]
    );
  }

  async updateSortOrder(id: number, sortOrder: number): Promise<void> {
    await pool.execute(
      'UPDATE resource_files SET sort_order = ? WHERE id = ?',
      [sortOrder, id]
    );
  }

  private mapRowToEntity(row: any): ResourceFile {
    return new ResourceFile(
      row.id,
      row.resource_id,
      row.file_path,
      row.original_filename,
      row.file_type,
      row.file_size,
      row.sort_order,
      row.download_count,
      new Date(row.created_at)
    );
  }
}
