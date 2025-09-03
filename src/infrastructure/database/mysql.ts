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
  keepAliveInitialDelay: 0,
  // Disable prepared statements to avoid parameter type issues
  namedPlaceholders: false,
  // Additional options for better compatibility
  timezone: '+00:00',
  charset: 'utf8mb4'
};

// Create connection pool
let pool: mysql.Pool;

try {
  pool = mysql.createPool(poolConfig);
  console.log('[MySQL] Connection pool created successfully');
} catch (error) {
  console.error('[MySQL] Failed to create connection pool:', error);
  throw error;
}

// Pool warming up function
async function warmupPool() {
  if (typeof window === 'undefined') {
    try {
      // Test connection
      const connection = await pool.getConnection();
      await connection.ping();
      connection.release();
      
      console.log('[MySQL] Connection pool warmed up');
    } catch (error) {
      console.error('[MySQL] Pool warmup failed:', error);
    }
  }
}

// Start warmup when module loads
if (typeof window === 'undefined') {
  // Immediate warmup
  warmupPool().catch(console.error);
}

// Export pool and helper functions
export { pool };

// Helper function to get a connection from the pool
export async function getConnection() {
  return await pool.getConnection();
}

// Helper function to execute a query - using query instead of execute for better compatibility
export async function query<T = any>(sql: string, params?: any[]): Promise<T[]> {
  try {
    // Clean up parameters
    const cleanParams = params ? params.map(param => {
      // Handle undefined as null
      if (param === undefined) return null;
      
      // Ensure numbers are properly typed
      if (typeof param === 'string' && /^\d+$/.test(param)) {
        const num = parseInt(param, 10);
        if (!isNaN(num)) return num;
      }
      
      return param;
    }) : [];
    
    // Use query() instead of execute() to avoid prepared statement issues
    const [rows] = await pool.query(sql, cleanParams);
    return rows as T[];
  } catch (error) {
    console.error('[MySQL] Query error:', error);
    throw error;
  }
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

// Graceful shutdown
if (typeof window === 'undefined' && process.env.NODE_ENV !== 'production') {
  const shutdown = async () => {
    try {
      await pool.end();
      console.log('[MySQL] Connection pool closed');
    } catch (error) {
      console.error('[MySQL] Error closing pool:', error);
    }
  };

  process.once('SIGTERM', shutdown);
  process.once('SIGINT', shutdown);
}