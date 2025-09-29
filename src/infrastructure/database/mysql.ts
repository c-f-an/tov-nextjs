import mysql from "mysql2/promise";
import { performance } from "perf_hooks";

// Optimized configuration for t2.micro (1GB RAM, 1 vCPU) with bot support
const T2_MICRO_OPTIMIZED_CONFIG = {
  // Connection pool sizing for t2.micro - optimized for bots
  connectionLimit: 8, // Increased for bot traffic
  maxIdle: 4, // Keep more idle connections for faster bot responses
  idleTimeout: 60000, // 60s - keep connections alive longer
  queueLimit: 30, // Increased queue for bot requests

  // Timeouts optimized for bot crawlers (Naver requires < 10s response)
  connectTimeout: 5000, // 5s connection timeout for faster fails

  // Keep-alive for persistent connections
  enableKeepAlive: true,
  keepAliveInitialDelay: 10000, // 10s

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

// Function to create connection pool
function createPool(): mysql.Pool {
  const newPool = mysql.createPool(poolConfig);
  console.log("[MySQL] Optimized connection pool created for t2.micro");

  // Monitor pool events (if available)
  const poolAny = newPool as any;
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

  // Add error handling for connection loss
  (newPool as any).on("error", (err: any) => {
    console.error("[MySQL] Pool error:", err);
    if (err.code === "PROTOCOL_CONNECTION_LOST") {
      console.log("[MySQL] Connection lost, recreating pool...");
      pool = createPool();
      if (process.env.NODE_ENV === "production") {
        globalThis.mysqlPool = pool;
      }
    }
  });

  return newPool;
}

// Create connection pool with event monitoring
let pool: mysql.Pool;

try {
  pool = createPool();
} catch (error) {
  console.error("[MySQL] Failed to create connection pool:", error);
  throw error;
}

// Singleton pattern for Next.js - prevent multiple pools in development
declare global {
  var mysqlPool: mysql.Pool | undefined;
  var mysqlPoolMetrics: typeof poolMetrics | undefined;
  var mysqlQueryMetrics: typeof queryMetrics | undefined;
}

if (process.env.NODE_ENV === "production") {
  pool = globalThis.mysqlPool || pool;
  globalThis.mysqlPool = pool;
} else {
  // In development, use global to preserve pool across HMR
  if (!globalThis.mysqlPool) {
    globalThis.mysqlPool = pool;
    globalThis.mysqlPoolMetrics = poolMetrics;
    globalThis.mysqlQueryMetrics = queryMetrics;
  } else {
    pool = globalThis.mysqlPool;
  }
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

// Keep-alive mechanism - ping every 2 minutes to prevent connection timeout
let lastPingTime = Date.now();
let connectionId: any = null;

if (typeof window === "undefined") {
  const keepAliveInterval = setInterval(async () => {
    try {
      const result = await pool.query("SELECT CONNECTION_ID() as id, NOW() as time");
      const newConnectionId = (result[0] as any)[0]?.id;

      if (connectionId && connectionId !== newConnectionId) {
        console.log(`[MySQL] Connection ID changed from ${connectionId} to ${newConnectionId}`);
      }
      connectionId = newConnectionId;
      lastPingTime = Date.now();

      console.log(`[MySQL] Keep-alive ping successful (ID: ${connectionId})`);
    } catch (error: any) {
      console.error("[MySQL] Keep-alive failed:", error.message);

      // Attempt to recreate pool on keep-alive failure
      try {
        pool = createPool();
        if (process.env.NODE_ENV === "production") {
          globalThis.mysqlPool = pool;
        }
        console.log("[MySQL] Pool recreated after keep-alive failure");

        // Test new pool
        const testResult = await pool.query("SELECT CONNECTION_ID() as id");
        connectionId = (testResult[0] as any)[0]?.id;
        lastPingTime = Date.now();
        console.log(`[MySQL] New pool tested successfully (ID: ${connectionId})`);
      } catch (recreateError) {
        console.error("[MySQL] Failed to recreate pool:", recreateError);
      }
    }
  }, 120000); // 2 minutes

  // Clean up interval on process termination
  process.once("SIGTERM", () => clearInterval(keepAliveInterval));
  process.once("SIGINT", () => clearInterval(keepAliveInterval));
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

// Get pool with validation - ensures connection is alive
export async function getPool(): Promise<mysql.Pool> {
  const now = Date.now();

  // Check connection every 30 seconds
  if (now - lastPingTime > 30000) {
    try {
      await pool.query("SELECT 1");
      lastPingTime = now;
    } catch (error: any) {
      console.error("[MySQL] Connection test failed, recreating pool:", error.message);
      pool = createPool();
      if (process.env.NODE_ENV === "production") {
        globalThis.mysqlPool = pool;
      }
      lastPingTime = now;
    }
  }

  return pool;
}

// Enhanced query function with performance tracking and auto-reconnect
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

    // Get validated pool and execute query
    const validatedPool = await getPool();
    const [rows] = await validatedPool.query(sql, cleanParams);

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
  } catch (error: any) {
    // Handle connection errors with reconnection logic
    if (
      error.code === "ECONNREFUSED" ||
      error.code === "PROTOCOL_CONNECTION_LOST" ||
      error.code === "ETIMEDOUT" ||
      error.code === "ENOTFOUND"
    ) {
      console.log("[MySQL] Connection lost, attempting to reconnect...");

      // Recreate pool
      try {
        pool = createPool();
        if (process.env.NODE_ENV === "production") {
          globalThis.mysqlPool = pool;
        }

        // Retry the query once
        const [rows] = await pool.query(sql, params || []);
        console.log("[MySQL] Reconnection successful, query executed");
        return rows as T[];
      } catch (retryError) {
        poolMetrics.lastError = retryError as Error;
        console.error("[MySQL] Query retry failed:", retryError);
        throw retryError;
      }
    }

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

// Get last ping information
export function getConnectionInfo() {
  return {
    connectionId,
    lastPingTime: new Date(lastPingTime).toISOString(),
    timeSinceLastPing: Date.now() - lastPingTime,
    isStale: Date.now() - lastPingTime > 60000,
  };
}

// Export everything needed for backward compatibility
export default {
  pool,
  query,
  queryOne,
  getConnection,
  getPool,
  withTransaction,
  getPoolStatus,
  getSlowQueries,
  getMemoryUsage,
  healthCheck,
  getConnectionInfo,
  poolMetrics,
  queryMetrics,
};
