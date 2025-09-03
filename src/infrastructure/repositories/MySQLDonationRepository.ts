import { IDonationRepository, DonationFilters, DonationStats } from '@/core/domain/repositories/IDonationRepository';
import { Donation, DonationStatus, DonationType, PaymentMethod } from '@/core/domain/entities/Donation';
import { PaginatedResult, PaginationParams } from '@/core/domain/repositories/IPostRepository';
import { query, queryOne } from '../database/mysql';
import { RowDataPacket } from 'mysql2';

interface DonationRow extends RowDataPacket {
  id: string;
  user_id: string;
  type: DonationType;
  status: DonationStatus;
  amount: number;
  payment_method: PaymentMethod;
  payment_day: number | null;
  start_date: Date;
  end_date: Date | null;
  last_payment_date: Date | null;
  next_payment_date: Date | null;
  total_amount: number;
  payment_count: number;
  receipt_required: boolean;
  receipt_email: string | null;
  receipt_phone: string | null;
  created_at: Date;
  updated_at: Date;
}

export class MySQLDonationRepository implements IDonationRepository {
  async findById(id: string): Promise<Donation | null> {
    const row = await queryOne<DonationRow>(
      'SELECT * FROM donations WHERE id = ?',
      [id]
    );
    
    return row ? this.mapToDonation(row) : null;
  }

  async findByUserId(userId: string, pagination: PaginationParams): Promise<PaginatedResult<Donation>> {
    const [countResult] = await query<any>(
      'SELECT COUNT(*) as total FROM donations WHERE user_id = ?',
      [userId]
    );
    const total = countResult.total;

    const offset = (pagination.page - 1) * pagination.limit;
    const rows = await query<DonationRow>(
      'SELECT * FROM donations WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?',
      [userId, Number(pagination.limit), Number(offset)]
    );

    return {
      data: rows.map(row => this.mapToDonation(row)),
      total,
      page: pagination.page,
      totalPages: Math.ceil(total / pagination.limit)
    };
  }

  async findAll(filters: DonationFilters, pagination: PaginationParams): Promise<PaginatedResult<Donation>> {
    let whereConditions: string[] = [];
    let params: any[] = [];

    if (filters.userId) {
      whereConditions.push('user_id = ?');
      params.push(filters.userId);
    }

    if (filters.type) {
      whereConditions.push('type = ?');
      params.push(filters.type);
    }

    if (filters.status) {
      whereConditions.push('status = ?');
      params.push(filters.status);
    }

    if (filters.amountMin !== undefined) {
      whereConditions.push('amount >= ?');
      params.push(filters.amountMin);
    }

    if (filters.amountMax !== undefined) {
      whereConditions.push('amount <= ?');
      params.push(filters.amountMax);
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
      `SELECT COUNT(*) as total FROM donations ${whereClause}`,
      params
    );
    const total = countResult.total;

    const offset = (pagination.page - 1) * pagination.limit;
    const rows = await query<DonationRow>(
      `SELECT * FROM donations ${whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [...params, Number(pagination.limit), Number(offset)]
    );

    return {
      data: rows.map(row => this.mapToDonation(row)),
      total,
      page: pagination.page,
      totalPages: Math.ceil(total / pagination.limit)
    };
  }

  async findDueForPayment(date: Date): Promise<Donation[]> {
    const rows = await query<DonationRow>(
      `SELECT * FROM donations 
       WHERE status = ? AND type = ? AND next_payment_date <= ?
       ORDER BY next_payment_date ASC`,
      [DonationStatus.ACTIVE, DonationType.REGULAR, date]
    );
    
    return rows.map(row => this.mapToDonation(row));
  }

  async save(donation: Donation): Promise<void> {
    await query(
      `INSERT INTO donations (id, user_id, type, status, amount, payment_method, payment_day, start_date, end_date, last_payment_date, next_payment_date, total_amount, payment_count, receipt_required, receipt_email, receipt_phone, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        donation.id,
        donation.userId,
        donation.type,
        donation.status,
        donation.amount,
        donation.paymentMethod,
        donation.paymentDay,
        donation.startDate,
        donation.endDate,
        donation.lastPaymentDate,
        donation.nextPaymentDate,
        donation.totalAmount,
        donation.paymentCount,
        donation.receiptRequired,
        donation.receiptEmail,
        donation.receiptPhone
      ]
    );
  }

  async update(donation: Donation): Promise<void> {
    await query(
      `UPDATE donations 
       SET user_id = ?, type = ?, status = ?, amount = ?, payment_method = ?, payment_day = ?, 
           start_date = ?, end_date = ?, last_payment_date = ?, next_payment_date = ?, 
           total_amount = ?, payment_count = ?, receipt_required = ?, receipt_email = ?, 
           receipt_phone = ?, updated_at = NOW()
       WHERE id = ?`,
      [
        donation.userId,
        donation.type,
        donation.status,
        donation.amount,
        donation.paymentMethod,
        donation.paymentDay,
        donation.startDate,
        donation.endDate,
        donation.lastPaymentDate,
        donation.nextPaymentDate,
        donation.totalAmount,
        donation.paymentCount,
        donation.receiptRequired,
        donation.receiptEmail,
        donation.receiptPhone,
        donation.id
      ]
    );
  }

  async delete(id: string): Promise<void> {
    await query('DELETE FROM donations WHERE id = ?', [id]);
  }

  async getStats(dateFrom?: Date, dateTo?: Date): Promise<DonationStats> {
    let whereConditions: string[] = ['status = ?'];
    let params: any[] = [DonationStatus.ACTIVE];

    if (dateFrom) {
      whereConditions.push('created_at >= ?');
      params.push(dateFrom);
    }

    if (dateTo) {
      whereConditions.push('created_at <= ?');
      params.push(dateTo);
    }

    const whereClause = `WHERE ${whereConditions.join(' AND ')}`;

    const [statsResult] = await query<any>(
      `SELECT 
        SUM(total_amount) as totalAmount,
        COUNT(DISTINCT user_id) as totalDonors,
        COUNT(DISTINCT CASE WHEN type = ? THEN user_id END) as regularDonors,
        COUNT(DISTINCT CASE WHEN type = ? THEN user_id END) as onetimeDonors,
        AVG(amount) as averageAmount
       FROM donations ${whereClause}`,
      [...params, DonationType.REGULAR, DonationType.ONETIME]
    );

    return {
      totalAmount: statsResult.totalAmount || 0,
      totalDonors: statsResult.totalDonors || 0,
      regularDonors: statsResult.regularDonors || 0,
      onetimeDonors: statsResult.onetimeDonors || 0,
      averageAmount: statsResult.averageAmount || 0
    };
  }

  private mapToDonation(row: DonationRow): Donation {
    return new Donation(
      row.id,
      row.user_id,
      row.type,
      row.status,
      row.amount,
      row.payment_method,
      row.start_date,
      row.total_amount,
      row.payment_count,
      row.receipt_required,
      row.created_at,
      row.updated_at,
      row.payment_day || undefined,
      row.end_date || undefined,
      row.last_payment_date || undefined,
      row.next_payment_date || undefined,
      row.receipt_email || undefined,
      row.receipt_phone || undefined
    );
  }
}