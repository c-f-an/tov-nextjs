import { IConsultationRepository, ConsultationFilters } from '@/core/domain/repositories/IConsultationRepository';
import { Consultation, ConsultationStatus, ConsultationType } from '@/core/domain/entities/Consultation';
import { PaginatedResult, PaginationParams } from '@/core/domain/repositories/IPostRepository';
import { query, queryOne } from '../database/mysql';
import { RowDataPacket } from 'mysql2';

interface ConsultationRow extends RowDataPacket {
  id: string;
  user_id: string | null;
  name: string;
  phone: string;
  email: string | null;
  church_name: string | null;
  position: string | null;
  consultation_type: ConsultationType;
  preferred_date: Date | null;
  preferred_time: string | null;
  title: string;
  content: string;
  status: ConsultationStatus;
  assigned_to: string | null;
  consultation_date: Date | null;
  consultation_notes: string | null;
  privacy_agree: boolean;
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
      [userId, Number(pagination.limit), Number(offset)]
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
      [counselorId, Number(pagination.limit), Number(offset)]
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
      [...params, Number(pagination.limit), Number(offset)]
    );

    return {
      data: rows.map(row => this.mapToConsultation(row)),
      total,
      page: pagination.page,
      totalPages: Math.ceil(total / pagination.limit)
    };
  }

  async save(consultation: Consultation): Promise<void> {
    // Note: This implementation assumes the Consultation entity will be updated
    // to include new fields matching the DB schema
    await query(
      `INSERT INTO consultations (id, user_id, name, phone, email, consultation_type, preferred_date, preferred_time, title, content, status, privacy_agree, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        consultation.id,
        consultation.userId || null,
        consultation.name || '',
        consultation.phone || '',
        consultation.email || null,
        consultation.type,
        consultation.preferredDate || null,
        consultation.preferredTime || null,
        consultation.title,
        consultation.content,
        consultation.status,
        true // privacy_agree default
      ]
    );
  }

  async update(consultation: Consultation): Promise<void> {
    await query(
      `UPDATE consultations
       SET status = ?, consultation_notes = ?, assigned_to = ?,
           consultation_date = ?, updated_at = NOW()
       WHERE id = ?`,
      [
        consultation.status,
        consultation.consultationNote || null,
        consultation.counselorId || null,
        consultation.completedAt || null,
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
    // Map DB row to Consultation entity with available fields
    const consultation = new Consultation(
      row.id,
      row.user_id || '',
      row.consultation_type,
      row.status,
      row.title,
      row.content,
      row.preferred_date || new Date(),
      row.preferred_time || '',
      row.created_at,
      row.updated_at,
      row.assigned_to || undefined,
      undefined, // attachments not in current schema
      row.consultation_notes || undefined,
      row.consultation_date || undefined
    );

    // Add additional fields from DB that are not in entity
    (consultation as any).name = row.name;
    (consultation as any).phone = row.phone;
    (consultation as any).email = row.email;
    (consultation as any).churchName = row.church_name;
    (consultation as any).position = row.position;

    return consultation;
  }
}