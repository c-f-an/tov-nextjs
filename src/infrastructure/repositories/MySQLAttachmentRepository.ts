import { IAttachmentRepository } from '@/core/domain/repositories/IAttachmentRepository';
import { Attachment } from '@/core/domain/entities/Attachment';
import { query, queryOne } from '../database/mysql';
import { RowDataPacket } from 'mysql2';

interface AttachmentRow extends RowDataPacket {
  id: number;
  attachable_type: string;
  attachable_id: number;
  filename: string;
  original_filename: string;
  path: string;
  mime_type: string | null;
  size: bigint | null;
  download_count: number;
  created_at: Date;
  updated_at: Date;
}

export class MySQLAttachmentRepository implements IAttachmentRepository {
  async findById(id: number): Promise<Attachment | null> {
    const row = await queryOne<AttachmentRow>(
      'SELECT * FROM attachments WHERE id = ?',
      [id]
    );
    
    return row ? this.mapToAttachment(row) : null;
  }

  async findByAttachable(attachableType: string, attachableId: number): Promise<Attachment[]> {
    const rows = await query<AttachmentRow>(
      'SELECT * FROM attachments WHERE attachable_type = ? AND attachable_id = ? ORDER BY created_at ASC',
      [attachableType, attachableId]
    );
    
    return rows.map(row => this.mapToAttachment(row));
  }

  async save(attachment: Attachment): Promise<Attachment> {
    const result = await query<any>(
      `INSERT INTO attachments (attachable_type, attachable_id, filename, original_filename, path, mime_type, size, download_count, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        attachment.attachableType,
        attachment.attachableId,
        attachment.filename,
        attachment.originalFilename,
        attachment.path,
        attachment.mimeType,
        attachment.size,
        attachment.downloadCount
      ]
    );
    
    return new Attachment(
      result.insertId,
      attachment.attachableType,
      attachment.attachableId,
      attachment.filename,
      attachment.originalFilename,
      attachment.path,
      attachment.mimeType,
      attachment.size,
      attachment.downloadCount,
      new Date(),
      new Date()
    );
  }

  async update(attachment: Attachment): Promise<void> {
    await query(
      `UPDATE attachments 
       SET attachable_type = ?, attachable_id = ?, filename = ?, original_filename = ?, 
           path = ?, mime_type = ?, size = ?, download_count = ?, updated_at = NOW()
       WHERE id = ?`,
      [
        attachment.attachableType,
        attachment.attachableId,
        attachment.filename,
        attachment.originalFilename,
        attachment.path,
        attachment.mimeType,
        attachment.size,
        attachment.downloadCount,
        attachment.id
      ]
    );
  }

  async delete(id: number): Promise<void> {
    await query('DELETE FROM attachments WHERE id = ?', [id]);
  }

  async deleteByAttachable(attachableType: string, attachableId: number): Promise<void> {
    await query(
      'DELETE FROM attachments WHERE attachable_type = ? AND attachable_id = ?',
      [attachableType, attachableId]
    );
  }

  private mapToAttachment(row: AttachmentRow): Attachment {
    return new Attachment(
      row.id,
      row.attachable_type,
      row.attachable_id,
      row.filename,
      row.original_filename,
      row.path,
      row.mime_type,
      row.size,
      row.download_count,
      row.created_at,
      row.updated_at
    );
  }
}