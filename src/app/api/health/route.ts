import { NextRequest, NextResponse } from "next/server";
import {
  query,
  getPool,
  getPoolStatus,
  getMemoryUsage
} from "@/infrastructure/database/mysql";

// Force dynamic rendering
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: NextRequest) {
  const startTime = Date.now();

  try {
    // Lightweight health check - single SELECT 1 query only
    await query("SELECT 1");

    const responseTime = Date.now() - startTime;
    const poolStatus = getPoolStatus();

    return NextResponse.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      responseTime: `${responseTime}ms`,
      database: {
        status: "healthy",
        latency: `${responseTime}ms`,
      },
      pool: {
        connectionLimit: poolStatus.config.connectionLimit,
        singleton: poolStatus.singleton,
      }
    }, {
      status: 200,
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
        "X-Response-Time": `${responseTime}ms`
      }
    });
  } catch (error: any) {
    const responseTime = Date.now() - startTime;

    return NextResponse.json({
      status: "unhealthy",
      timestamp: new Date().toISOString(),
      responseTime: `${responseTime}ms`,
      database: {
        status: "unhealthy",
        error: error.message,
        code: error.code
      }
    }, {
      status: 503,
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
        "X-Response-Time": `${responseTime}ms`
      }
    });
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