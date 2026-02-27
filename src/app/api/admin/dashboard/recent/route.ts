import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminRequest } from '@/lib/auth-admin';
import { pool } from '@/infrastructure/database/mysql';

export async function GET(request: NextRequest) {
  try {
    console.log('Dashboard recent endpoint called');

    // Verify admin access
    const admin = await verifyAdminRequest(request);
    if (!admin) {
      console.log('Admin verification failed');
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    console.log('Admin verified:', admin.email);

    // Get recent posts (5 latest)
    const [postRows] = await pool.execute(`
      SELECT
        p.id,
        p.title,
        c.type as category,
        p.created_at,
        u.name as author_name
      FROM posts p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN users u ON p.user_id = u.id
      WHERE p.status = 'published'
      ORDER BY p.created_at DESC
      LIMIT 5
    `);

    console.log('Posts query result count:', Array.isArray(postRows) ? postRows.length : 0);

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

    console.log('Consultations query result count:', Array.isArray(consultationRows) ? consultationRows.length : 0);

    const response = {
      recentPosts: postRows,
      recentConsultations: consultationRows
    };

    console.log('Returning response with posts:', (response.recentPosts as unknown[])?.length, 'consultations:', (response.recentConsultations as unknown[])?.length);

    return NextResponse.json(response);
  } catch (error) {
    console.error('Dashboard recent data error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recent data' },
      { status: 500 }
    );
  }
}