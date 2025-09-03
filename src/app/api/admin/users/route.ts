import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminRequest, logAdminAction } from '@/lib/auth-admin';
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

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    const role = searchParams.get('role') || '';
    const status = searchParams.get('status') || '';
    const offset = (page - 1) * limit;

    // Build query conditions
    let whereConditions = [];
    let queryParams = [];

    if (search) {
      whereConditions.push('(name LIKE ? OR email LIKE ? OR username LIKE ?)');
      const searchPattern = `%${search}%`;
      queryParams.push(searchPattern, searchPattern, searchPattern);
    }

    if (role && role !== '전체') {
      whereConditions.push('role = ?');
      queryParams.push(role);
    }

    if (status && status !== '전체') {
      whereConditions.push('status = ?');
      queryParams.push(status);
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    // Get total count
    const [countResult] = await pool.execute(
      `SELECT COUNT(*) as total FROM users ${whereClause}`,
      queryParams
    );
    const totalCount = Number(countResult[0]?.total || 0);

    // Get users
    const [users] = await pool.execute(
      `SELECT 
        id, 
        email, 
        name, 
        phone, 
        username,
        status, 
        login_type, 
        DATE_FORMAT(created_at, '%Y.%m.%d') as joinDate,
        CASE 
          WHEN last_login_at IS NULL THEN NULL
          ELSE DATE_FORMAT(last_login_at, '%Y.%m.%d %H:%i')
        END as lastLogin
       FROM users
       ${whereClause}
       ORDER BY created_at DESC
       LIMIT ? OFFSET ?`,
      [...queryParams, limit, offset]
    );

    // Log admin action
    await logAdminAction(
      admin.id,
      'VIEW_USERS',
      null,
      null,
      { search, role, status, page },
      request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
      request.headers.get('user-agent')
    );

    return NextResponse.json({
      users: users || [],
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit)
      }
    });
  } catch (error) {
    console.error('Admin users error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    // Verify admin access
    const admin = await verifyAdminRequest(request);
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { userId, action, value } = body;

    if (!userId || !action) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    let updateQuery = '';
    let updateParams = [];

    switch (action) {
      case 'UPDATE_STATUS':
        if (!value || !['active', 'inactive', 'suspended'].includes(value)) {
          return NextResponse.json(
            { error: 'Invalid status value' },
            { status: 400 }
          );
        }
        updateQuery = 'UPDATE users SET status = ? WHERE id = ?';
        updateParams = [value, userId];
        break;

      case 'UPDATE_ROLE':
        if (!value || !['USER', 'ADMIN'].includes(value)) {
          return NextResponse.json(
            { error: 'Invalid role value' },
            { status: 400 }
          );
        }
        updateQuery = 'UPDATE users SET role = ? WHERE id = ?';
        updateParams = [value, userId];
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

    // Execute update
    const [result] = await pool.execute(updateQuery, updateParams);

    // Log admin action
    await logAdminAction(
      admin.id,
      action,
      'users',
      userId,
      { value },
      request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
      request.headers.get('user-agent')
    );

    return NextResponse.json({
      success: true,
      message: 'User updated successfully'
    });
  } catch (error) {
    console.error('Admin user update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}