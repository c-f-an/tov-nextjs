import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminRequest } from '@/lib/auth-admin';
import { query } from '@/infrastructure/database/mysql';

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

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const adminId = searchParams.get('adminId');
    const action = searchParams.get('action');
    const entityType = searchParams.get('entityType');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const offset = (page - 1) * limit;

    // Build query conditions
    let whereConditions = [];
    let queryParams = [];

    if (adminId) {
      whereConditions.push('al.admin_id = ?');
      queryParams.push(adminId);
    }

    if (action) {
      whereConditions.push('al.action LIKE ?');
      queryParams.push(`%${action}%`);
    }

    if (entityType) {
      whereConditions.push('al.entity_type = ?');
      queryParams.push(entityType);
    }

    if (startDate) {
      whereConditions.push('al.created_at >= ?');
      queryParams.push(startDate);
    }

    if (endDate) {
      whereConditions.push('al.created_at <= ?');
      queryParams.push(endDate);
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    // Get total count
    const countResult = await query(
      `SELECT COUNT(*) as total FROM admin_logs al ${whereClause}`,
      queryParams
    );
    const totalCount = Number(countResult[0]?.total || 0);

    // Get logs with admin user info
    const logs = await query(
      `SELECT
        al.id,
        al.admin_id,
        al.action,
        al.entity_type,
        al.entity_id,
        al.details,
        al.ip_address,
        al.user_agent,
        al.created_at,
        u.name as admin_name,
        u.email as admin_email
       FROM admin_logs al
       LEFT JOIN users u ON al.admin_id = u.id
       ${whereClause}
       ORDER BY al.created_at DESC
       LIMIT ? OFFSET ?`,
      [...queryParams, limit, offset]
    );

    // Parse JSON details for each log
    const parsedLogs = (logs as any[]).map(log => ({
      ...log,
      details: log.details ? JSON.parse(log.details) : null
    }));

    return NextResponse.json({
      logs: parsedLogs || [],
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit)
      }
    });
  } catch (error) {
    console.error('Admin logs error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}