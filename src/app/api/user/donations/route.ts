import { NextRequest, NextResponse } from 'next/server';
import { Container } from '@/infrastructure/config/container';
import { query } from '@/infrastructure/database/mysql';
import { RowDataPacket } from 'mysql2';

interface DonationWithSponsor extends RowDataPacket {
  id: number;
  sponsor_id: number;
  donation_type: 'regular' | 'one_time';
  amount: number;
  payment_method: string | null;
  payment_date: Date;
  receipt_number: string | null;
  purpose: string | null;
  memo: string | null;
  cms_bank: string | null;
  cms_account_number: string | null;
  cms_account_holder: string | null;
  cms_withdrawal_day: string | null;
  created_at: Date;
  updated_at: Date;
}

export async function GET(request: NextRequest) {
  try {
    // Token verification (same as /api/user/profile)
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const container = Container.getInstance();
    const authService = container.getAuthService();
    const payload = await authService.verifyAccessToken(token);

    if (!payload || typeof payload.userId !== 'number') {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const userId = payload.userId;
    console.log('[User Donations API] User ID:', userId);

    // Get donations for the current user by joining sponsors and donations tables
    const donations = await query<DonationWithSponsor>(
      `SELECT
        d.id,
        d.sponsor_id,
        d.donation_type,
        d.amount,
        d.payment_method,
        d.payment_date,
        d.receipt_number,
        d.purpose,
        d.memo,
        d.cms_bank,
        d.cms_account_number,
        d.cms_account_holder,
        d.cms_withdrawal_day,
        d.created_at,
        d.updated_at
      FROM donations d
      INNER JOIN sponsors s ON d.sponsor_id = s.id
      WHERE s.user_id = ?
      ORDER BY d.payment_date DESC, d.created_at DESC`,
      [userId]
    );

    console.log('[User Donations API] Found donations:', donations.length);
    console.log('[User Donations API] Donations data:', JSON.stringify(donations, null, 2));

    // Calculate total amount for the current year
    const currentYear = new Date().getFullYear();
    const totalAmount = donations
      .filter(d => new Date(d.payment_date).getFullYear() === currentYear)
      .reduce((sum, d) => sum + Number(d.amount), 0);

    console.log('[User Donations API] Total amount for', currentYear, ':', totalAmount);

    return NextResponse.json({
      donations,
      totalAmount,
      year: currentYear
    });
  } catch (error) {
    console.error('[User Donations API] Error fetching user donations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch donations' },
      { status: 500 }
    );
  }
}
