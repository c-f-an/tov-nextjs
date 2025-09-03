import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminRequest, logAdminAction } from '@/lib/auth-admin';
import { pool } from '@/lib/db';

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

    // Get dashboard statistics
    const [userStats] = await pool.execute(
      'SELECT COUNT(*) as total, SUM(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 1 ELSE 0 END) as new_this_month FROM users'
    );

    const [postStats] = await pool.execute(
      'SELECT COUNT(*) as total, SUM(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) THEN 1 ELSE 0 END) as new_this_week FROM posts WHERE status = ?',
      ['published']
    );

    const [consultationStats] = await pool.execute(
      'SELECT COUNT(*) as pending FROM consultations WHERE status = ?',
      ['pending']
    );

    const [donationStats] = await pool.execute(
      'SELECT COALESCE(SUM(amount), 0) as monthly_total FROM donations WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) AND status = ?',
      ['completed']
    );

    // Get recent posts
    const [recentPosts] = await pool.execute(
      `SELECT p.id, p.title, p.created_at, c.name as category_name, c.slug as category_slug, u.name as author_name
       FROM posts p
       LEFT JOIN categories c ON p.category_id = c.id
       LEFT JOIN users u ON p.user_id = u.id
       WHERE p.status = ?
       ORDER BY p.created_at DESC
       LIMIT 5`,
      ['published']
    );

    // Get recent consultations
    const [recentConsultations] = await pool.execute(
      `SELECT id, name, phone, consultation_type, status, created_at
       FROM consultations
       ORDER BY created_at DESC
       LIMIT 5`
    );

    // Get today's active users count
    const [activeUsers] = await pool.execute(
      'SELECT COUNT(DISTINCT id) as today_active FROM users WHERE DATE(last_login_at) = CURDATE()'
    );

    // Log admin action
    await logAdminAction(
      admin.id,
      'VIEW_DASHBOARD',
      null,
      null,
      null,
      request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
      request.headers.get('user-agent')
    );

    return NextResponse.json({
      stats: {
        totalUsers: Number(userStats[0]?.total || 0),
        newUsersThisMonth: Number(userStats[0]?.new_this_month || 0),
        totalPosts: Number(postStats[0]?.total || 0),
        newPostsThisWeek: Number(postStats[0]?.new_this_week || 0),
        pendingConsultations: Number(consultationStats[0]?.pending || 0),
        monthlyDonations: Number(donationStats[0]?.monthly_total || 0),
        todayActiveUsers: Number(activeUsers[0]?.today_active || 0)
      },
      recentPosts: recentPosts || [],
      recentConsultations: recentConsultations || []
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}