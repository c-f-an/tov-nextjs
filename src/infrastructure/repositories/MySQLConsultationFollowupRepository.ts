import { IConsultationFollowupRepository } from '@/core/domain/repositories/IConsultationFollowupRepository';
import { ConsultationFollowup, FollowupStatus, MeetingType } from '@/core/domain/entities/ConsultationFollowup';
import { query, queryOne } from '../database/mysql';
import { RowDataPacket } from 'mysql2';

interface ConsultationFollowupRow extends RowDataPacket {
  id: number;
  original_consultation_id: number;
  followup_consultation_id: number | null;
  followup_order: number;
  meeting_type: number | null;
  scheduled_at: Date | null;
  met_at: Date | null;
  topic: string | null;
  notes: string | null;
  assigned_to: number | null;
  status: number;
  created_at: Date;
  updated_at: Date;
}

export class MySQLConsultationFollowupRepository implements IConsultationFollowupRepository {
  async findByOriginalConsultationId(originalConsultationId: number): Promise<ConsultationFollowup[]> {
    const rows = await query<ConsultationFollowupRow>(
      'SELECT * FROM consultation_followups WHERE original_consultation_id = ? ORDER BY followup_order ASC',
      [originalConsultationId]
    );
    return rows.map(row => this.mapToEntity(row));
  }

  async findById(id: number): Promise<ConsultationFollowup | null> {
    const row = await queryOne<ConsultationFollowupRow>(
      'SELECT * FROM consultation_followups WHERE id = ?',
      [id]
    );
    return row ? this.mapToEntity(row) : null;
  }

  async save(followup: ConsultationFollowup): Promise<number> {
    const result = await query<any>(
      `INSERT INTO consultation_followups
        (original_consultation_id, followup_consultation_id, followup_order,
         meeting_type, scheduled_at, met_at, topic, notes, assigned_to, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        followup.originalConsultationId,
        followup.followupConsultationId,
        followup.followupOrder,
        followup.meetingType,
        followup.scheduledAt,
        followup.metAt,
        followup.topic,
        followup.notes,
        followup.assignedTo,
        followup.status,
      ]
    );
    return (result as any).insertId;
  }

  async update(followup: ConsultationFollowup): Promise<void> {
    await query(
      `UPDATE consultation_followups
       SET followup_consultation_id = ?, meeting_type = ?,
           scheduled_at = ?, met_at = ?, topic = ?, notes = ?,
           assigned_to = ?, status = ?, updated_at = NOW()
       WHERE id = ?`,
      [
        followup.followupConsultationId,
        followup.meetingType,
        followup.scheduledAt,
        followup.metAt,
        followup.topic,
        followup.notes,
        followup.assignedTo,
        followup.status,
        followup.id,
      ]
    );
  }

  async delete(id: number): Promise<void> {
    await query('DELETE FROM consultation_followups WHERE id = ?', [id]);
  }

  async getNextFollowupOrder(originalConsultationId: number): Promise<number> {
    const [result] = await query<any>(
      'SELECT COALESCE(MAX(followup_order), 0) + 1 AS next_order FROM consultation_followups WHERE original_consultation_id = ?',
      [originalConsultationId]
    );
    return result.next_order;
  }

  private mapToEntity(row: ConsultationFollowupRow): ConsultationFollowup {
    return new ConsultationFollowup(
      row.id,
      row.original_consultation_id,
      row.followup_consultation_id,
      row.followup_order,
      row.meeting_type as MeetingType | null,
      row.scheduled_at,
      row.met_at,
      row.topic,
      row.notes,
      row.assigned_to,
      row.status as FollowupStatus,
      row.created_at,
      row.updated_at
    );
  }
}
