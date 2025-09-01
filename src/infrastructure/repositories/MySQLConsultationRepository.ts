import { IConsultationRepository, ConsultationFilters } from '@/core/domain/repositories/IConsultationRepository';
import { Consultation, ConsultationStatus, ConsultationType } from '@/core/domain/entities/Consultation';
import { PaginatedResult, PaginationParams } from '@/core/domain/repositories/IPostRepository';
import { query, queryOne } from '../database/mysql';
import { RowDataPacket } from 'mysql2';

interface ConsultationRow extends RowDataPacket {
  id: string;
  user_id: string;
  counselor_id: string | null;
  type: ConsultationType;
  status: ConsultationStatus;
  title: string;
  content: string;
  attachments: string | null;
  preferred_date: Date;
  preferred_time: string;
  consultation_note: string | null;
  completed_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

export class MySQLConsultationRepository implements IConsultationRepository {
  async findById(id: string): Promise<Consultation | null> {
    const row = await queryOne<ConsultationRow>(
      'SELECT * FROM consultations WHERE id = ?',
      [id]
    );
    
    return row ? this.mapToConsultation(row) : null;
  }

  async findByUserId(userId: string, pagination: PaginationParams): Promise<PaginatedResult<Consultation>> {
    const [countResult] = await query<any>(
      'SELECT COUNT(*) as total FROM consultations WHERE user_id = ?',
      [userId]
    );
    const total = countResult.total;

    const offset = (pagination.page - 1) * pagination.limit;
    const rows = await query<ConsultationRow>(
      'SELECT * FROM consultations WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?',
      [userId, pagination.limit, offset]
    );

    return {
      data: rows.map(row => this.mapToConsultation(row)),
      total,
      page: pagination.page,
      totalPages: Math.ceil(total / pagination.limit)
    };
  }

  async findByCounselorId(counselorId: string, pagination: PaginationParams): Promise<PaginatedResult<Consultation>> {
    const [countResult] = await query<any>(
      'SELECT COUNT(*) as total FROM consultations WHERE counselor_id = ?',
      [counselorId]
    );
    const total = countResult.total;

    const offset = (pagination.page - 1) * pagination.limit;
    const rows = await query<ConsultationRow>(
      'SELECT * FROM consultations WHERE counselor_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?',
      [counselorId, pagination.limit, offset]
    );

    return {
      data: rows.map(row => this.mapToConsultation(row)),
      total,
      page: pagination.page,
      totalPages: Math.ceil(total / pagination.limit)
    };
  }

  async findAll(filters: ConsultationFilters, pagination: PaginationParams): Promise<PaginatedResult<Consultation>> {
    let whereConditions: string[] = [];
    let params: any[] = [];

    if (filters.userId) {
      whereConditions.push('user_id = ?');
      params.push(filters.userId);
    }

    if (filters.counselorId) {
      whereConditions.push('counselor_id = ?');
      params.push(filters.counselorId);
    }

    if (filters.type) {
      whereConditions.push('type = ?');
      params.push(filters.type);
    }

    if (filters.status) {
      whereConditions.push('status = ?');
      params.push(filters.status);
    }

    if (filters.dateFrom) {
      whereConditions.push('created_at >= ?');
      params.push(filters.dateFrom);
    }

    if (filters.dateTo) {
      whereConditions.push('created_at <= ?');
      params.push(filters.dateTo);
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';
    
    const [countResult] = await query<any>(
      `SELECT COUNT(*) as total FROM consultations ${whereClause}`,
      params
    );
    const total = countResult.total;

    const offset = (pagination.page - 1) * pagination.limit;
    const rows = await query<ConsultationRow>(
      `SELECT * FROM consultations ${whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [...params, pagination.limit, offset]
    );

    return {
      data: rows.map(row => this.mapToConsultation(row)),
      total,
      page: pagination.page,
      totalPages: Math.ceil(total / pagination.limit)
    };
  }

  async save(consultation: Consultation): Promise<void> {
    const attachmentsJson = consultation.attachments ? JSON.stringify(consultation.attachments) : null;
    
    await query(
      `INSERT INTO consultations (id, user_id, counselor_id, type, status, title, content, attachments, preferred_date, preferred_time, consultation_note, completed_at, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        consultation.id,
        consultation.userId,
        consultation.counselorId,
        consultation.type,
        consultation.status,
        consultation.title,
        consultation.content,
        attachmentsJson,
        consultation.preferredDate,
        consultation.preferredTime,
        consultation.consultationNote,
        consultation.completedAt
      ]
    );
  }

  async update(consultation: Consultation): Promise<void> {
    const attachmentsJson = consultation.attachments ? JSON.stringify(consultation.attachments) : null;
    
    await query(
      `UPDATE consultations 
       SET user_id = ?, counselor_id = ?, type = ?, status = ?, title = ?, content = ?, 
           attachments = ?, preferred_date = ?, preferred_time = ?, consultation_note = ?, 
           completed_at = ?, updated_at = NOW()
       WHERE id = ?`,
      [
        consultation.userId,
        consultation.counselorId,
        consultation.type,
        consultation.status,
        consultation.title,
        consultation.content,
        attachmentsJson,
        consultation.preferredDate,
        consultation.preferredTime,
        consultation.consultationNote,
        consultation.completedAt,
        consultation.id
      ]
    );
  }

  async delete(id: string): Promise<void> {
    await query('DELETE FROM consultations WHERE id = ?', [id]);
  }

  async countByStatus(status: ConsultationStatus): Promise<number> {
    const [result] = await query<any>(
      'SELECT COUNT(*) as count FROM consultations WHERE status = ?',
      [status]
    );
    return result.count;
  }

  private mapToConsultation(row: ConsultationRow): Consultation {
    const attachments = row.attachments ? JSON.parse(row.attachments) : undefined;
    
    return new Consultation(
      row.id,
      row.user_id,
      row.type,
      row.status,
      row.title,
      row.content,
      row.preferred_date,
      row.preferred_time,
      row.created_at,
      row.updated_at,
      row.counselor_id || undefined,
      attachments,
      row.consultation_note || undefined,
      row.completed_at || undefined
    );
  }
}