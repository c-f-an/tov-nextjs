import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
const bcrypt = require('bcryptjs');

export async function GET() {
  let connection;
  
  try {
    // Parse DATABASE_URL from environment
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      throw new Error('DATABASE_URL is not configured');
    }

    // Parse connection details from DATABASE_URL
    const url = new URL(databaseUrl.replace('mysql://', 'http://'));
    
    // Create direct MySQL connection
    connection = await mysql.createConnection({
      host: url.hostname,
      port: parseInt(url.port || '3306'),
      user: url.username,
      password: url.password,
      database: url.pathname.slice(1)
    });

    // Get posts with category and user info
    const [posts] = await connection.execute(`
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
  } catch (error: any) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error.message 
      },
      { status: 500 }
    );
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

export async function POST() {
  let connection;
  
  try {
    // Parse DATABASE_URL from environment
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      throw new Error('DATABASE_URL is not configured');
    }

    // Parse connection details from DATABASE_URL
    const url = new URL(databaseUrl.replace('mysql://', 'http://'));
    
    // Create direct MySQL connection
    connection = await mysql.createConnection({
      host: url.hostname,
      port: parseInt(url.port || '3306'),
      user: url.username,
      password: url.password,
      database: url.pathname.slice(1)
    });

    const testPassword = 'password123';
    
    // Get admin user
    const [users] = await connection.execute(
      'SELECT id, email, password, name FROM users WHERE email = ?',
      ['admin@tov.or.kr']
    );

    if (!Array.isArray(users) || users.length === 0) {
      return NextResponse.json({ 
        success: false,
        error: 'User not found' 
      });
    }

    const adminUser = users[0] as any;
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
  } catch (error: any) {
    console.error('Error testing login:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error.message 
      },
      { status: 500 }
    );
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}