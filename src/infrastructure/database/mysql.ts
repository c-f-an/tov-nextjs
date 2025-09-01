import mysql from 'mysql2/promise';

// MySQL connection pool configuration
const poolConfig = {
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '3306'),
  user: process.env.DATABASE_USER || 'root',
  password: process.env.DATABASE_PASSWORD || '',
  database: process.env.DATABASE_NAME || 'tov_db',
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10,
  idleTimeout: 60000,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
};

// Create connection pool
const pool = mysql.createPool(poolConfig);

// Pool warming up function
async function warmupPool() {
  if (typeof window === 'undefined') {
    const promises = [];
    // Warm up the connection pool
    for (let i = 0; i < 5; i++) {
      promises.push(pool.execute('SELECT 1'));
    }
    try {
      await Promise.all(promises);
      console.log('[MySQL] Connection pool warmed up');
    } catch (error) {
      console.error('[MySQL] Pool warmup failed:', error);
    }
  }
}

// Start warmup when module loads - delayed to avoid connection issues during startup
if (typeof window === 'undefined') {
  setTimeout(() => {
    warmupPool().catch(console.error);
  }, 1000); // 1 second delay
}

// Keep-Alive functionality
if (typeof window === 'undefined') {
  const keepAliveInterval = setInterval(async () => {
    try {
      await pool.execute('SELECT 1');
      console.log(`[${new Date().toISOString()}] MySQL DB Keep-alive OK`);
    } catch (error) {
      console.error('MySQL Keep-alive failed:', error);
    }
  }, 5 * 60 * 1000); // Every 5 minutes

  // Cleanup on process termination
  if (process.env.NODE_ENV !== 'production') {
    process.on('SIGTERM', () => {
      clearInterval(keepAliveInterval);
      pool.end();
    });
    process.on('SIGINT', () => {
      clearInterval(keepAliveInterval);
      pool.end();
    });
  }
}

// Export pool and helper functions
export { pool };

// Helper function to get a connection from the pool
export async function getConnection() {
  return await pool.getConnection();
}

// Helper function to execute a query
export async function query<T = any>(sql: string, params?: any[]): Promise<T[]> {
  const [rows] = await pool.execute(sql, params);
  return rows as T[];
}

// Helper function to execute a single row query
export async function queryOne<T = any>(sql: string, params?: any[]): Promise<T | null> {
  const rows = await query<T>(sql, params);
  return rows.length > 0 ? rows[0] : null;
}

// Transaction helper
export async function withTransaction<T>(
  callback: (connection: mysql.PoolConnection) => Promise<T>
): Promise<T> {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const result = await callback(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}