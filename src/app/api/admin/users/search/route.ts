import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminRequest } from '@/lib/auth-admin';
import { query } from '@/infrastructure/database/mysql';

// GET /api/admin/users/search?q=검색어 (전화번호 or 이메일)
export async function GET(request: NextRequest) {
  try {
    const admin = await verifyAdminRequest(request);
    if (!admin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const q = request.nextUrl.searchParams.get('q')?.trim() || '';
    if (!q || q.length < 2) {
      return NextResponse.json({ users: [] });
    }

    const pattern = `%${q}%`;
    const users = await query(
      `SELECT id, name, phone, email
       FROM users
       WHERE (phone LIKE ? OR email LIKE ?)
         AND status != 'deleted'
       ORDER BY created_at DESC
       LIMIT 10`,
      [pattern, pattern]
    );

    return NextResponse.json({ users: users || [] });
  } catch (error) {
    console.error('Error searching users:', error);
    return NextResponse.json({ error: 'Failed to search users' }, { status: 500 });
  }
}
