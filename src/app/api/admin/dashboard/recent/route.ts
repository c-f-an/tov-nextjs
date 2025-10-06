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

    // Get recent posts (5 latest)
    const [postRows] = await pool.execute(`
      SELECT
        p.id,
        p.title,
        p.category,
        p.created_at,
        u.name as author_name
      FROM posts p
      LEFT JOIN users u ON p.author_id = u.id
      WHERE p.status = 'published'
      ORDER BY p.created_at DESC
      LIMIT 5
    `);

    // Get recent consultations (5 latest)
    const [consultationRows] = await pool.execute(`
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
    `);

    return NextResponse.json({
      recentPosts: postRows,
      recentConsultations: consultationRows
    });
  } catch (error) {
    console.error('Dashboard recent data error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recent data' },
      { status: 500 }
    );
  }
}