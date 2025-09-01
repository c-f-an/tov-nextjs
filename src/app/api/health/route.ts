import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

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

    // DB 연결 확인
    await connection.execute('SELECT 1');
    
    return NextResponse.json({ 
      status: 'healthy',
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('Health check failed:', error);
    return NextResponse.json(
      { 
        status: 'unhealthy',
        error: error.message 
      },
      { status: 503 }
    );
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}