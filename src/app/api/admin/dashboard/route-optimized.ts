import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/infrastructure/database/mysql';
import { verifyJWT } from '@/lib/auth';
import { performance } from 'perf_hooks';

export async function GET(request: NextRequest) {
  const startTime = performance.now();
  
  try {
    // Verify authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const payload = await verifyJWT(token);
    
    if (!payload || payload.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Execute all queries in parallel for better performance
    const [
      userStatsResult,
      postStatsResult,
      consultationStatsResult,
      donationStatsResult,
      recentPostsResult,
      recentConsultationsResult,
      activeUsersResult,
      monthlyStatsResult,
    ] = await Promise.all([
      // User statistics
      pool.query(`
        SELECT 
          COUNT(*) as total,
          SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active,
          SUM(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) THEN 1 ELSE 0 END) as new_this_week
        FROM users
      `),
      
      // Post statistics
      pool.query(`
        SELECT 
          COUNT(*) as total,
          SUM(CASE WHEN status = 'published' THEN 1 ELSE 0 END) as published,
          SUM(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) THEN 1 ELSE 0 END) as new_this_week
        FROM posts
      `),
      
      // Consultation statistics
      pool.query(`
        SELECT 
          COUNT(*) as total,
          SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
          SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
          SUM(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) THEN 1 ELSE 0 END) as new_this_week
        FROM consultations
      `),
      
      // Donation statistics with optimized aggregation
      pool.query(`
        SELECT 
          COUNT(*) as total,
          COALESCE(SUM(amount), 0) as total_amount,
          COALESCE(SUM(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN amount ELSE 0 END), 0) as amount_this_month,
          SUM(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) THEN 1 ELSE 0 END) as new_this_week
        FROM donations
      `),
      
      // Recent posts with minimal data
      pool.query(`
        SELECT 
          p.id,
          p.title,
          p.status,
          p.created_at,
          u.name as author_name,
          c.name as category_name
        FROM posts p
        LEFT JOIN users u ON p.author_id = u.id
        LEFT JOIN categories c ON p.category_id = c.id
        ORDER BY p.created_at DESC
        LIMIT 5
      `),
      
      // Recent consultations with minimal data
      pool.query(`
        SELECT 
          c.id,
          c.title,
          c.status,
          c.created_at,
          u.name as user_name
        FROM consultations c
        LEFT JOIN users u ON c.user_id = u.id
        ORDER BY c.created_at DESC
        LIMIT 5
      `),
      
      // Active users (logged in within 24 hours)
      pool.query(`
        SELECT COUNT(*) as count
        FROM users
        WHERE last_login_at >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
      `),
      
      // Monthly statistics for chart (optimized single query)
      pool.query(`
        WITH months AS (
          SELECT 0 as n UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 
          UNION SELECT 4 UNION SELECT 5
        )
        SELECT 
          DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL n MONTH), '%Y-%m') as month,
          (SELECT COUNT(*) FROM users WHERE DATE_FORMAT(created_at, '%Y-%m') = DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL n MONTH), '%Y-%m')) as users,
          (SELECT COUNT(*) FROM posts WHERE DATE_FORMAT(created_at, '%Y-%m') = DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL n MONTH), '%Y-%m')) as posts,
          (SELECT COUNT(*) FROM consultations WHERE DATE_FORMAT(created_at, '%Y-%m') = DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL n MONTH), '%Y-%m')) as consultations,
          (SELECT COALESCE(SUM(amount), 0) FROM donations WHERE DATE_FORMAT(created_at, '%Y-%m') = DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL n MONTH), '%Y-%m')) as donations
        FROM months
        ORDER BY month DESC
      `),
    ]);

    // Process results
    const [userStats] = userStatsResult[0] as any[];
    const [postStats] = postStatsResult[0] as any[];
    const [consultationStats] = consultationStatsResult[0] as any[];
    const [donationStats] = donationStatsResult[0] as any[];
    const recentPosts = recentPostsResult[0] as any[];
    const recentConsultations = recentConsultationsResult[0] as any[];
    const [activeUsersData] = activeUsersResult[0] as any[];
    const monthlyStats = monthlyStatsResult[0] as any[];

    // Calculate query time
    const queryTime = performance.now() - startTime;

    const dashboardData = {
      stats: {
        users: {
          total: Number(userStats.total),
          active: Number(userStats.active),
          newThisWeek: Number(userStats.new_this_week),
        },
        posts: {
          total: Number(postStats.total),
          published: Number(postStats.published),
          newThisWeek: Number(postStats.new_this_week),
        },
        consultations: {
          total: Number(consultationStats.total),
          pending: Number(consultationStats.pending),
          completed: Number(consultationStats.completed),
          newThisWeek: Number(consultationStats.new_this_week),
        },
        donations: {
          total: Number(donationStats.total),
          totalAmount: Number(donationStats.total_amount),
          amountThisMonth: Number(donationStats.amount_this_month),
          newThisWeek: Number(donationStats.new_this_week),
        },
      },
      recentActivity: {
        posts: recentPosts,
        consultations: recentConsultations,
      },
      activeUsers: Number(activeUsersData.count),
      chartData: {
        monthly: monthlyStats.map((row: any) => ({
          month: row.month,
          users: Number(row.users),
          posts: Number(row.posts),
          consultations: Number(row.consultations),
          donations: Number(row.donations),
        })),
      },
      performance: {
        queryTime: Math.round(queryTime),
        timestamp: new Date().toISOString(),
      },
    };

    // Add cache headers for client-side caching (1 minute)
    return NextResponse.json(dashboardData, {
      headers: {
        'Cache-Control': 'private, max-age=60',
        'X-Query-Time': `${Math.round(queryTime)}ms`,
      },
    });

  } catch (error) {
    console.error('[Dashboard] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}