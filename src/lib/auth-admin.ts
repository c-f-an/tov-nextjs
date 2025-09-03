import { NextRequest } from 'next/server';
import { verifyAccessToken } from './auth-utils';
import { pool } from '@/lib/db';

export interface AdminUser {
  id: number;
  email: string;
  name: string;
  role: 'ADMIN';
  loginType: string;
}

export async function verifyAdminRequest(request: NextRequest): Promise<AdminUser | null> {
  try {
    // Get access token from Authorization header
    const authHeader = request.headers.get('Authorization');
    const accessToken = authHeader?.replace('Bearer ', '');
    
    if (!accessToken) {
      return null;
    }
    
    // Verify access token
    const jwtSecret = process.env.JWT_ACCESS_SECRET || 'default-access-secret';
    const payload = verifyAccessToken(accessToken, jwtSecret);
    
    if (!payload) {
      return null;
    }
    
    // Check if user has admin role
    const [rows] = await pool.execute(
      'SELECT id, email, name, role, login_type FROM users WHERE id = ? AND role = ? AND status = ?',
      [payload.userId, 'ADMIN', 'active']
    );
    
    if (!Array.isArray(rows) || rows.length === 0) {
      return null;
    }
    
    const user = rows[0] as any;
    
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      loginType: user.login_type
    };
  } catch (error) {
    console.error('Admin verification error:', error);
    return null;
  }
}

export async function logAdminAction(
  adminId: number,
  action: string,
  entityType?: string,
  entityId?: number,
  details?: any,
  ipAddress?: string,
  userAgent?: string
) {
  try {
    await pool.execute(
      `INSERT INTO admin_logs (admin_id, action, entity_type, entity_id, details, ip_address, user_agent) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        adminId,
        action,
        entityType || null,
        entityId || null,
        details ? JSON.stringify(details) : null,
        ipAddress || null,
        userAgent || null
      ]
    );
  } catch (error) {
    console.error('Failed to log admin action:', error);
  }
}