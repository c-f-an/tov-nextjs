import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminRequest } from '@/lib/auth-admin';
import { pool } from '@/infrastructure/database/mysql';

export async function GET(request: NextRequest) {
  try {
    // Verify admin access
    const admin = await verifyAdminRequest(request);
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    // Get sponsors with user information and donation totals
    const [sponsors] = await pool.execute(`
      SELECT 
        s.id,
        s.user_id as userId,
        u.name as userName,
        u.email as userEmail,
        u.phone as userPhone,
        s.sponsor_type as sponsorType,
        s.amount,
        s.sponsor_status as sponsorStatus,
        DATE_FORMAT(s.start_date, '%Y.%m.%d') as startDate,
        (
          SELECT SUM(amount) 
          FROM donations 
          WHERE sponsor_id = s.id AND status = 'completed'
        ) as totalAmount,
        (
          SELECT DATE_FORMAT(MAX(payment_date), '%Y.%m.%d')
          FROM donations 
          WHERE sponsor_id = s.id AND status = 'completed'
        ) as lastPaymentDate,
        (
          SELECT COUNT(*) 
          FROM donations 
          WHERE sponsor_id = s.id AND status = 'completed'
        ) as paymentCount
      FROM sponsors s
      JOIN users u ON s.user_id = u.id
      ORDER BY s.created_at DESC
    `);

    // Transform results to ensure proper data types
    const transformedSponsors = (sponsors as any[]).map(sponsor => ({
      ...sponsor,
      amount: Number(sponsor.amount),
      totalAmount: Number(sponsor.totalAmount) || 0,
      paymentCount: Number(sponsor.paymentCount) || 0
    }));

    return NextResponse.json({
      sponsors: transformedSponsors
    });
  } catch (error) {
    console.error('Failed to fetch sponsors:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}