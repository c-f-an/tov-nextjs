const mysql = require('mysql2/promise');

async function testConnection() {
  const config = {
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT || '3306'),
    user: process.env.DATABASE_USER || 'root',
    password: process.env.DATABASE_PASSWORD || '',
    database: process.env.DATABASE_NAME || 'tov_db',
  };

  console.log('Testing MySQL connection with config:', {
    ...config,
    password: config.password ? '***' : '(empty)'
  });

  try {
    const connection = await mysql.createConnection(config);
    console.log('✅ Connected to MySQL successfully!');

    // Test query
    const [rows] = await connection.execute('SELECT 1 as test');
    console.log('✅ Test query successful:', rows);

    // Test posts table
    const [posts] = await connection.execute(`
      SELECT COUNT(*) as count FROM posts
    `);
    console.log('✅ Posts count:', posts[0].count);

    await connection.end();
    console.log('✅ Connection closed successfully');
  } catch (error) {
    console.error('❌ MySQL connection failed:', error.message);
    process.exit(1);
  }
}

testConnection();