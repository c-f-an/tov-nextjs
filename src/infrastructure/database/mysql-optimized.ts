import mysql from "mysql2/promise";
import { performance } from "perf_hooks";

// Optimized configuration for t2.micro (1GB RAM, 1 vCPU)
const T2_MICRO_OPTIMIZED_CONFIG = {
  // Connection pool sizing for t2.micro - ULTRA CONSERVATIVE
  connectionLimit: 2, // Minimal connections for t2.micro
  maxIdle: 1, // Keep only 1 idle connection
  idleTimeout: 60000, // 60s - keep connections alive longer
  queueLimit: 10, // Reduce queue to prevent memory issues

  // Timeouts optimized for RDS in same VPC
  connectTimeout: 10000, // 10s connection timeout (reduced)
  timeout: 15000, // 15s query timeout (reduced)

  // Keep-alive for persistent connections - AGGRESSIVE
  enableKeepAlive: true,
  keepAliveInitialDelay: 30000, // 30s - less frequent pings

  // Performance optimizations
  namedPlaceholders: false, // Keep disabled as per current setup
  multipleStatements: false, // Security: prevent SQL injection

  // Connection settings
  timezone: "+00:00",
  charset: "utf8mb4",
  dateStrings: false,
  supportBigNumbers: true,
  bigNumberStrings: false,

  // Additional performance settings
  flags: "-FOUND_ROWS", // Disable FOUND_ROWS for better performance
  decimalNumbers: true,
};

// Parse DATABASE_URL if provided
let poolConfig: mysql.PoolOptions;

if (process.env.DATABASE_URL) {
  const dbUrl = new URL(process.env.DATABASE_URL);
  poolConfig = {
    host: dbUrl.hostname,
    port: parseInt(dbUrl.port || "3306"),
    user: dbUrl.username,
    password: dbUrl.password || "",
    database: dbUrl.pathname.slice(1),
    waitForConnections: true,
    ...T2_MICRO_OPTIMIZED_CONFIG,
  };
} else {
  poolConfig = {
    host: process.env.DATABASE_HOST || "localhost",
    port: parseInt(process.env.DATABASE_PORT || "3306"),
    user: process.env.DATABASE_USER || "root",
    password: process.env.DATABASE_PASSWORD || "",
    database: process.env.DATABASE_NAME || "tov_db",
    waitForConnections: true,
    ...T2_MICRO_OPTIMIZED_CONFIG,
  };
}

// Connection pool metrics
const poolMetrics = {
  totalConnections: 0,
  activeConnections: 0,
  idleConnections: 0,
  queuedRequests: 0,
  connectionErrors: 0,
  queryCount: 0,
  slowQueries: 0,
  lastError: null as Error | null,
};

// Query performance tracking
const queryMetrics = new Map<
  string,
  {
    count: number;
    totalTime: number;
    avgTime: number;
    maxTime: number;
    minTime: number;
  }
>();

// Create connection pool with event monitoring
let pool: mysql.Pool;

try {
  pool = mysql.createPool(poolConfig);
  console.log("[MySQL] Optimized connection pool created for t2.micro");

  // Monitor pool events (if available)
  const poolAny = pool as any;
  if (poolAny.pool) {
    poolAny.pool.on("acquire", () => {
      poolMetrics.activeConnections++;
      poolMetrics.totalConnections++;
    });

    poolAny.pool.on("release", () => {
      poolMetrics.activeConnections--;
    });

    poolAny.pool.on("enqueue", () => {
      poolMetrics.queuedRequests++;
    });
  }
} catch (error) {
  console.error("[MySQL] Failed to create connection pool:", error);
  throw error;
}

// Singleton pattern for Next.js
declare global {
  var mysqlPool: mysql.Pool | undefined;
}

if (process.env.NODE_ENV === "production") {
  pool = globalThis.mysqlPool || pool;
  globalThis.mysqlPool = pool;
}

// Enhanced warmup with performance check
async function warmupPool() {
  if (typeof window === "undefined") {
    try {
      const startTime = performance.now();
      const connection = await pool.getConnection();

      // Test query performance
      await connection.query("SELECT 1");
      const pingTime = performance.now() - startTime;

      connection.release();

      console.log(`[MySQL] Pool warmed up (ping: ${pingTime.toFixed(2)}ms)`);

      // Warning if initial connection is slow
      if (pingTime > 1000) {
        console.warn(
          "[MySQL] Slow initial connection detected:",
          pingTime.toFixed(2),
          "ms"
        );
      }
    } catch (error) {
      poolMetrics.connectionErrors++;
      poolMetrics.lastError = error as Error;
      console.error("[MySQL] Pool warmup failed:", error);
    }
  }
}

// Start warmup
if (typeof window === "undefined") {
  warmupPool().catch(console.error);
}

// Export pool and metrics
export { pool, poolMetrics, queryMetrics };

// Get pool status
export function getPoolStatus() {
  const poolAny = pool as any;
  return {
    ...poolMetrics,
    config: {
      connectionLimit: poolConfig.connectionLimit,
      idleTimeout: poolConfig.idleTimeout,
      queueLimit: poolConfig.queueLimit,
    },
    pool: poolAny.pool
      ? {
          size: poolAny.pool.size,
          available: poolAny.pool.available,
          pending: poolAny.pool.pending,
          borrowed: poolAny.pool.borrowed,
          spareResourceCapacity: poolAny.pool.spareResourceCapacity,
        }
      : null,
  };
}

// Enhanced query function with performance tracking
export async function query<T = any>(
  sql: string,
  params?: any[]
): Promise<T[]> {
  const startTime = performance.now();
  const queryKey = sql.substring(0, 50); // First 50 chars for metrics key

  try {
    poolMetrics.queryCount++;

    // Clean parameters
    const cleanParams = params
      ? params.map((param) => {
          if (param === undefined) return null;
          if (typeof param === "string" && /^\d+$/.test(param)) {
            const num = parseInt(param, 10);
            if (!isNaN(num)) return num;
          }
          return param;
        })
      : [];

    // Execute query
    const [rows] = await pool.query(sql, cleanParams);

    // Track performance
    const duration = performance.now() - startTime;
    updateQueryMetrics(queryKey, duration);

    // Log slow queries
    if (duration > 1000) {
      poolMetrics.slowQueries++;
      console.warn(
        `[MySQL] Slow query detected (${duration.toFixed(2)}ms):`,
        queryKey
      );
    }

    return rows as T[];
  } catch (error) {
    poolMetrics.lastError = error as Error;
    console.error("[MySQL] Query error:", error);
    throw error;
  }
}

// Update query metrics
function updateQueryMetrics(queryKey: string, duration: number) {
  const existing = queryMetrics.get(queryKey) || {
    count: 0,
    totalTime: 0,
    avgTime: 0,
    maxTime: 0,
    minTime: Infinity,
  };

  existing.count++;
  existing.totalTime += duration;
  existing.avgTime = existing.totalTime / existing.count;
  existing.maxTime = Math.max(existing.maxTime, duration);
  existing.minTime = Math.min(existing.minTime, duration);

  queryMetrics.set(queryKey, existing);
}

// Helper to get top slow queries
export function getSlowQueries(limit = 10) {
  return Array.from(queryMetrics.entries())
    .sort((a, b) => b[1].avgTime - a[1].avgTime)
    .slice(0, limit)
    .map(([query, metrics]) => ({
      query,
      ...metrics,
      avgTime: metrics.avgTime.toFixed(2),
      maxTime: metrics.maxTime.toFixed(2),
      minTime: metrics.minTime.toFixed(2),
    }));
}

// Memory usage checker
export function getMemoryUsage() {
  if (typeof window === "undefined" && process.memoryUsage) {
    const usage = process.memoryUsage();
    return {
      rss: Math.round(usage.rss / 1024 / 1024), // MB
      heapTotal: Math.round(usage.heapTotal / 1024 / 1024), // MB
      heapUsed: Math.round(usage.heapUsed / 1024 / 1024), // MB
      external: Math.round(usage.external / 1024 / 1024), // MB
    };
  }
  return null;
}

// Connection helper
export async function getConnection() {
  try {
    return await pool.getConnection();
  } catch (error) {
    poolMetrics.connectionErrors++;
    poolMetrics.lastError = error as Error;
    throw error;
  }
}

// Single row query
export async function queryOne<T = any>(
  sql: string,
  params?: any[]
): Promise<T | null> {
  const rows = await query<T>(sql, params);
  return rows.length > 0 ? rows[0] : null;
}

// Transaction helper with monitoring
export async function withTransaction<T>(
  callback: (connection: mysql.PoolConnection) => Promise<T>
): Promise<T> {
  const connection = await getConnection();
  const startTime = performance.now();

  try {
    await connection.beginTransaction();
    const result = await callback(connection);
    await connection.commit();

    const duration = performance.now() - startTime;
    if (duration > 1000) {
      console.warn(
        `[MySQL] Slow transaction detected: ${duration.toFixed(2)}ms`
      );
    }

    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

// Health check
export async function healthCheck(): Promise<{
  status: "healthy" | "unhealthy";
  latency: number;
  poolStatus: any;
  memoryUsage: any;
  errors: number;
  lastError: string | null;
}> {
  const startTime = performance.now();
  let status: "healthy" | "unhealthy" = "healthy";

  try {
    await query("SELECT 1");
  } catch (error) {
    status = "unhealthy";
  }

  const latency = performance.now() - startTime;

  return {
    status,
    latency: Math.round(latency),
    poolStatus: getPoolStatus(),
    memoryUsage: getMemoryUsage(),
    errors: poolMetrics.connectionErrors,
    lastError: poolMetrics.lastError ? poolMetrics.lastError.message : null,
  };
}

// Graceful shutdown
if (typeof window === "undefined") {
  const shutdown = async () => {
    try {
      console.log("[MySQL] Closing connection pool...");
      await pool.end();
      console.log("[MySQL] Connection pool closed");
    } catch (error) {
      console.error("[MySQL] Error closing pool:", error);
    }
  };

  process.once("SIGTERM", shutdown);
  process.once("SIGINT", shutdown);
}

// Export everything needed
export default {
  pool,
  query,
  queryOne,
  getConnection,
  withTransaction,
  getPoolStatus,
  getSlowQueries,
  getMemoryUsage,
  healthCheck,
  poolMetrics,
  queryMetrics,
};
