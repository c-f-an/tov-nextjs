import { IConsultationResponseRepository } from '@/core/domain/repositories/IConsultationResponseRepository';
import { ConsultationResponse, ResponseType } from '@/core/domain/entities/ConsultationResponse';
import { query, queryOne } from '../database/mysql';
import { RowDataPacket } from 'mysql2';

interface ConsultationResponseRow extends RowDataPacket {
  id: number;
  consultation_id: number;
  responder_id: number | null;
  responder_name: string | null;
  response_type: number;
  content: string;
  is_public: number;
  created_at: Date;
  updated_at: Date;
}

export class MySQLConsultationResponseRepository implements IConsultationResponseRepository {
  async findByConsultationId(consultationId: number): Promise<ConsultationResponse[]> {
    const rows = await query<ConsultationResponseRow>(
      'SELECT * FROM consultation_responses WHERE consultation_id = ? ORDER BY created_at ASC',
      [consultationId]
    );
    return rows.map(row => this.mapToEntity(row));
  }

  async findById(id: number): Promise<ConsultationResponse | null> {
    const row = await queryOne<ConsultationResponseRow>(
      'SELECT * FROM consultation_responses WHERE id = ?',
      [id]
    );
    return row ? this.mapToEntity(row) : null;
  }

  async save(response: ConsultationResponse): Promise<number> {
    const result = await query<any>(
      `INSERT INTO consultation_responses
        (consultation_id, responder_id, responder_name, response_type, content, is_public)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        response.consultationId,
        response.responderId,
        response.responderName,
        response.responseType,
        response.content,
        response.isPublic ? 1 : 0,
      ]
    );
    return (result as any).insertId;
  }

  async update(response: ConsultationResponse): Promise<void> {
    await query(
      `UPDATE consultation_responses
       SET responder_id = ?, responder_name = ?, response_type = ?,
           content = ?, is_public = ?, updated_at = NOW()
       WHERE id = ?`,
      [
        response.responderId,
        response.responderName,
        response.responseType,
        response.content,
        response.isPublic ? 1 : 0,
        response.id,
      ]
    );
  }

  async delete(id: number): Promise<void> {
    await query('DELETE FROM consultation_responses WHERE id = ?', [id]);
  }

  private mapToEntity(row: ConsultationResponseRow): ConsultationResponse {
    return new ConsultationResponse(
      row.id,
      row.consultation_id,
      row.responder_id,
      row.responder_name,
      row.response_type as ResponseType,
      row.content,
      row.is_public === 1,
      row.created_at,
      row.updated_at
    );
  }
}
