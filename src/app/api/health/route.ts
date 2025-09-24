import { NextRequest, NextResponse } from "next/server";
import {
  query,
  getPool,
  healthCheck,
  getConnectionInfo,
  getPoolStatus,
  getMemoryUsage
} from "@/infrastructure/database/mysql";

// Force dynamic rendering
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: NextRequest) {
  const startTime = Date.now();

  try {
    // Run health check from mysql.ts
    const health = await healthCheck();

    // Get additional connection info
    const connectionInfo = getConnectionInfo();

    // Try to get current connection ID
    let currentConnectionId = null;
    try {
      const result = await query("SELECT CONNECTION_ID() as id, NOW() as serverTime");
      currentConnectionId = result[0]?.id;
    } catch (error) {
      console.error("[Health API] Failed to get connection ID:", error);
    }

    // Get process list count for monitoring
    let connectionCount = 0;
    try {
      const processListQuery = `
        SELECT COUNT(*) as count
        FROM information_schema.processlist
        WHERE USER IN (?, ?, ?)
      `;
      const result = await query(processListQuery, [
        process.env.DATABASE_USER || "tov-client",
        "admin",
        "root"
      ]);
      connectionCount = result[0]?.count || 0;
    } catch (error) {
      console.error("[Health API] Failed to get process list:", error);
    }

    const responseTime = Date.now() - startTime;

    const response = {
      status: health.status,
      timestamp: new Date().toISOString(),
      responseTime: `${responseTime}ms`,
      database: {
        status: health.status,
        latency: `${health.latency}ms`,
        currentConnectionId,
        totalConnections: connectionCount,
        errors: health.errors,
        lastError: health.lastError
      },
      connection: {
        ...connectionInfo,
        poolAlive: !!currentConnectionId,
        requiresReconnect: connectionInfo.isStale
      },
      pool: health.poolStatus,
      memory: health.memoryUsage,
      environment: {
        nodeEnv: process.env.NODE_ENV,
        host: process.env.DATABASE_HOST || "localhost",
        database: process.env.DATABASE_NAME || process.env.DB_NAME || "tov_db"
      }
    };

    // Set appropriate status code
    const statusCode = health.status === "healthy" && !connectionInfo.isStale ? 200 : 503;

    return NextResponse.json(response, {
      status: statusCode,
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
        "X-Response-Time": `${responseTime}ms`
      }
    });
  } catch (error: any) {
    console.error("[Health API] Error:", error);

    const responseTime = Date.now() - startTime;

    return NextResponse.json(
      {
        status: "error",
        timestamp: new Date().toISOString(),
        responseTime: `${responseTime}ms`,
        error: {
          message: error.message,
          code: error.code,
          errno: error.errno,
          sqlState: error.sqlState
        },
        database: {
          status: "unhealthy",
          latency: null,
          currentConnectionId: null,
          totalConnections: 0
        },
        connection: {
          poolAlive: false,
          requiresReconnect: true
        },
        memory: getMemoryUsage()
      },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
          "X-Response-Time": `${responseTime}ms`
        }
      }
    );
  }
}

// POST endpoint to force reconnection
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));

    if (body.action === "reconnect") {
      // Force a reconnection by calling getPool
      const pool = await getPool();

      // Test the new connection
      const result = await query("SELECT CONNECTION_ID() as id, NOW() as time");

      return NextResponse.json({
        success: true,
        message: "Connection refreshed",
        connectionId: result[0]?.id,
        serverTime: result[0]?.time
      });
    }

    return NextResponse.json(
      { error: "Invalid action" },
      { status: 400 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message
      },
      { status: 500 }
    );
  }
}