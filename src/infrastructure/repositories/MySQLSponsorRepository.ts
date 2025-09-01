import { ISponsorRepository } from '@/core/domain/repositories/ISponsorRepository';
import { Sponsor, SponsorType, SponsorStatus } from '@/core/domain/entities/Sponsor';
import { query, queryOne } from '../database/mysql';
import { RowDataPacket } from 'mysql2';

interface SponsorRow extends RowDataPacket {
  id: number;
  user_id: number | null;
  sponsor_type: SponsorType;
  name: string;
  organization_name: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  postcode: string | null;
  sponsor_status: SponsorStatus;
  privacy_agree: boolean;
  receipt_required: boolean;
  created_at: Date;
  updated_at: Date;
}

export class MySQLSponsorRepository implements ISponsorRepository {
  async findById(id: number): Promise<Sponsor | null> {
    const row = await queryOne<SponsorRow>(
      'SELECT * FROM sponsors WHERE id = ?',
      [id]
    );
    
    return row ? this.mapToSponsor(row) : null;
  }

  async findByUserId(userId: number): Promise<Sponsor[]> {
    const rows = await query<SponsorRow>(
      'SELECT * FROM sponsors WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );
    
    return rows.map(row => this.mapToSponsor(row));
  }

  async findAll(): Promise<Sponsor[]> {
    const rows = await query<SponsorRow>(
      'SELECT * FROM sponsors ORDER BY created_at DESC'
    );
    
    return rows.map(row => this.mapToSponsor(row));
  }

  async save(sponsor: Sponsor): Promise<Sponsor> {
    const result = await query<any>(
      `INSERT INTO sponsors (user_id, sponsor_type, name, organization_name, phone, email, address, postcode, sponsor_status, privacy_agree, receipt_required, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        sponsor.userId,
        sponsor.sponsorType,
        sponsor.name,
        sponsor.organizationName,
        sponsor.phone,
        sponsor.email,
        sponsor.address,
        sponsor.postcode,
        sponsor.sponsorStatus,
        sponsor.privacyAgree,
        sponsor.receiptRequired
      ]
    );
    
    return new Sponsor(
      result.insertId,
      sponsor.userId,
      sponsor.sponsorType,
      sponsor.name,
      sponsor.organizationName,
      sponsor.phone,
      sponsor.email,
      sponsor.address,
      sponsor.postcode,
      sponsor.sponsorStatus,
      sponsor.privacyAgree,
      sponsor.receiptRequired,
      new Date(),
      new Date()
    );
  }

  async delete(id: number): Promise<void> {
    await query('DELETE FROM sponsors WHERE id = ?', [id]);
  }

  private mapToSponsor(row: SponsorRow): Sponsor {
    return new Sponsor(
      row.id,
      row.user_id,
      row.sponsor_type,
      row.name,
      row.organization_name,
      row.phone,
      row.email,
      row.address,
      row.postcode,
      row.sponsor_status,
      row.privacy_agree,
      row.receipt_required,
      row.created_at,
      row.updated_at
    );
  }
}