import { NextResponse } from 'next/server';
import { query, queryOne } from '@/infrastructure/database/mysql';

export async function GET() {
  try {
    // Get posts with category and user info
    const posts = await query(`
      SELECT 
        p.id,
        p.title,
        p.slug,
        p.excerpt,
        p.status,
        p.view_count,
        p.published_at,
        c.name as category_name,
        u.name as author_name
      FROM posts p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN users u ON p.user_id = u.id
      WHERE p.status = 'published'
      ORDER BY p.published_at DESC
      LIMIT 10
    `);

    return NextResponse.json({
      success: true,
      data: posts
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    // Test login with bcrypt
    const bcrypt = require('bcryptjs');
    const testPassword = 'password123';
    
    // Get admin user
    const adminUser = await queryOne<{
      id: number;
      email: string;
      password: string;
      name: string;
    }>(`
      SELECT id, email, password, name
      FROM users
      WHERE email = ?
      LIMIT 1
    `, ['admin@tov.or.kr']);

    if (!adminUser) {
      return NextResponse.json({ 
        success: false,
        error: 'User not found' 
      });
    }
    const isValidPassword = await bcrypt.compare(testPassword, adminUser.password);

    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: adminUser.id,
          email: adminUser.email,
          name: adminUser.name
        },
        passwordValid: isValidPassword
      }
    });
  } catch (error) {
    console.error('Error testing login:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}