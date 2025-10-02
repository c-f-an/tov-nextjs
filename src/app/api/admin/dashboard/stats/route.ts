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

    // Get total users count
    const [userRows] = await pool.execute(
      'SELECT COUNT(*) as count FROM users WHERE status = ?',
      ['active']
    );
    const totalUsers = (userRows as any)[0]?.count || 0;

    // Get total posts count
    const [postRows] = await pool.execute(
      'SELECT COUNT(*) as count FROM posts WHERE status = ?',
      ['published']
    );
    const totalPosts = (postRows as any)[0]?.count || 0;

    // Get pending consultations count
    const [consultationRows] = await pool.execute(
      'SELECT COUNT(*) as count FROM consultations WHERE status = ?',
      ['pending']
    );
    const pendingConsultations = (consultationRows as any)[0]?.count || 0;

    // Get this month's donations total
    const currentDate = new Date();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const [donationRows] = await pool.execute(
      'SELECT COALESCE(SUM(amount), 0) as total FROM donations WHERE created_at >= ?',
      [firstDayOfMonth]
    );
    const monthlyDonations = (donationRows as any)[0]?.total || 0;

    return NextResponse.json({
      totalUsers,
      totalPosts,
      pendingConsultations,
      monthlyDonations
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    );
  }
}