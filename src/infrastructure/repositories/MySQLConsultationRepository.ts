import { IConsultationRepository, ConsultationFilters } from '@/core/domain/repositories/IConsultationRepository';
import { Consultation, ConsultationStatus, InquiryChannel, InquiryCategory, PositionCode } from '@/core/domain/entities/Consultation';
import { PaginatedResult, PaginationParams } from '@/core/domain/repositories/IPostRepository';
import { query, queryOne } from '../database/mysql';
import { RowDataPacket } from 'mysql2';

interface ConsultationRow extends RowDataPacket {
  id: number;
  user_id: number | null;
  name: string;
  name_public: number;
  phone: string;
  phone_public: number;
  email: string | null;
  church_name: string | null;
  church_public: number;
  position: string | null;
  position_code: number | null;
  consultation_type: string;
  inquiry_channel: number | null;
  inquiry_category: number | null;
  category_detail: string | null;
  preferred_date: Date | null;
  preferred_time: string | null;
  title: string;
  content: string;
  status: ConsultationStatus;
  assigned_to: number | null;
  consultation_date: Date | null;
  consultation_notes: string | null;
  privacy_agree: number;
  created_at: Date;
  updated_at: Date;
}

export class MySQLConsultationRepository implements IConsultationRepository {
  async findById(id: number): Promise<Consultation | null> {
    const row = await queryOne<ConsultationRow>(
      'SELECT * FROM consultations WHERE id = ?',
      [id]
    );
    return row ? this.mapToConsultation(row) : null;
  }

  async findByUserId(userId: number, pagination: PaginationParams): Promise<PaginatedResult<Consultation>> {
    const offset = (pagination.page - 1) * pagination.limit;
    const [countResult, rows] = await Promise.all([
      query<any>('SELECT COUNT(*) as total FROM consultations WHERE user_id = ?', [userId]),
      query<ConsultationRow>(
        'SELECT * FROM consultations WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?',
        [userId, Number(pagination.limit), Number(offset)]
      )
    ]);
    const total = countResult[0].total;
    return {
      data: rows.map(row => this.mapToConsultation(row)),
      total,
      page: pagination.page,
      totalPages: Math.ceil(total / pagination.limit)
    };
  }

  async findAll(filters: ConsultationFilters, pagination: PaginationParams): Promise<PaginatedResult<Consultation>> {
    const conditions: string[] = [];
    const params: any[] = [];

    if (filters.userId !== undefined) {
      conditions.push('user_id = ?');
      params.push(filters.userId);
    }
    if (filters.assignedTo !== undefined) {
      conditions.push('assigned_to = ?');
      params.push(filters.assignedTo);
    }
    if (filters.status) {
      conditions.push('status = ?');
      params.push(filters.status);
    }
    if (filters.inquiryChannel !== undefined) {
      conditions.push('inquiry_channel = ?');
      params.push(filters.inquiryChannel);
    }
    if (filters.inquiryCategory !== undefined) {
      conditions.push('inquiry_category = ?');
      params.push(filters.inquiryCategory);
    }
    if (filters.dateFrom) {
      conditions.push('created_at >= ?');
      params.push(filters.dateFrom);
    }
    if (filters.dateTo) {
      conditions.push('created_at <= ?');
      params.push(filters.dateTo);
    }
    if (filters.keyword) {
      conditions.push('MATCH(title, content) AGAINST(? IN BOOLEAN MODE)');
      params.push(filters.keyword);
    }

    const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const offset = (pagination.page - 1) * pagination.limit;

    const [countResult, rows] = await Promise.all([
      query<any>(`SELECT COUNT(*) as total FROM consultations ${where}`, params),
      query<ConsultationRow>(
        `SELECT * FROM consultations ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
        [...params, Number(pagination.limit), Number(offset)]
      )
    ]);
    const total = countResult[0].total;
    return {
      data: rows.map(row => this.mapToConsultation(row)),
      total,
      page: pagination.page,
      totalPages: Math.ceil(total / pagination.limit)
    };
  }

  async save(consultation: Consultation): Promise<number> {
    const result = await query<any>(
      `INSERT INTO consultations
        (user_id, name, name_public, phone, phone_public, email,
         church_name, church_public, position, position_code,
         consultation_type, inquiry_channel, inquiry_category, category_detail,
         preferred_date, preferred_time, title, content, status,
         assigned_to, consultation_date, consultation_notes,
         privacy_agree, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        consultation.userId,
        consultation.name,
        consultation.namePublic ? 1 : 0,
        consultation.phone,
        consultation.phonePublic ? 1 : 0,
        consultation.email,
        consultation.churchName,
        consultation.churchPublic ? 1 : 0,
        consultation.position,
        consultation.positionCode,
        consultation.consultationType,
        consultation.inquiryChannel,
        consultation.inquiryCategory,
        consultation.categoryDetail,
        consultation.preferredDate,
        consultation.preferredTime,
        consultation.title,
        consultation.content,
        consultation.status,
        consultation.assignedTo,
        consultation.consultationDate,
        consultation.consultationNotes,
        consultation.privacyAgree ? 1 : 0,
      ]
    );
    return (result as any).insertId;
  }

  async update(consultation: Consultation): Promise<void> {
    await query(
      `UPDATE consultations
       SET name = ?, name_public = ?, phone = ?, phone_public = ?,
           email = ?, church_name = ?, church_public = ?,
           position = ?, position_code = ?,
           consultation_type = ?, inquiry_channel = ?, inquiry_category = ?,
           category_detail = ?, preferred_date = ?, preferred_time = ?,
           title = ?, content = ?, status = ?,
           assigned_to = ?, consultation_date = ?, consultation_notes = ?,
           updated_at = NOW()
       WHERE id = ?`,
      [
        consultation.name,
        consultation.namePublic ? 1 : 0,
        consultation.phone,
        consultation.phonePublic ? 1 : 0,
        consultation.email,
        consultation.churchName,
        consultation.churchPublic ? 1 : 0,
        consultation.position,
        consultation.positionCode,
        consultation.consultationType,
        consultation.inquiryChannel,
        consultation.inquiryCategory,
        consultation.categoryDetail,
        consultation.preferredDate,
        consultation.preferredTime,
        consultation.title,
        consultation.content,
        consultation.status,
        consultation.assignedTo,
        consultation.consultationDate,
        consultation.consultationNotes,
        consultation.id,
      ]
    );
  }

  async delete(id: number): Promise<void> {
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
    return new Consultation(
      row.id,
      row.user_id,
      row.name,
      row.name_public === 1,
      row.phone,
      row.phone_public === 1,
      row.email,
      row.church_name,
      row.church_public === 1,
      row.position,
      row.position_code as PositionCode | null,
      row.consultation_type,
      row.inquiry_channel as InquiryChannel | null,
      row.inquiry_category as InquiryCategory | null,
      row.category_detail,
      row.preferred_date,
      row.preferred_time,
      row.title,
      row.content,
      row.status,
      row.assigned_to,
      row.consultation_date,
      row.consultation_notes,
      row.privacy_agree === 1,
      row.created_at,
      row.updated_at
    );
  }
}
