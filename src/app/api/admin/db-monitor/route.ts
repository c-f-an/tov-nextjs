import { NextRequest, NextResponse } from 'next/server';
import { healthCheck, getPoolStatus, getSlowQueries, getMemoryUsage } from '@/infrastructure/database/mysql';

// DB monitoring API - only accessible in development or with secret key
export async function GET(request: NextRequest) {
  // Security check
  const authHeader = request.headers.get('authorization');
  const isAuthorized = process.env.NODE_ENV === 'development' || 
    authHeader === `Bearer ${process.env.DB_MONITOR_SECRET}`;
  
  if (!isAuthorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    // Get comprehensive health check
    const health = await healthCheck();
    
    // Get detailed metrics
    const poolStatus = getPoolStatus();
    const slowQueries = getSlowQueries(20);
    const memoryUsage = getMemoryUsage();
    
    // Calculate pool efficiency
    const poolEfficiency = poolStatus.totalConnections > 0
      ? ((poolStatus.totalConnections - poolStatus.connectionErrors) / poolStatus.totalConnections * 100).toFixed(2)
      : 100;
    
    // Warnings
    const warnings = [];
    
    // Check for connection pool issues
    if (poolStatus.queuedRequests > 5) {
      warnings.push(`High queue depth: ${poolStatus.queuedRequests} requests waiting`);
    }
    
    if (poolStatus.connectionErrors > 0) {
      warnings.push(`Connection errors detected: ${poolStatus.connectionErrors}`);
    }
    
    if (health.latency > 100) {
      warnings.push(`High DB latency: ${health.latency}ms`);
    }
    
    if (poolStatus.slowQueries > 10) {
      warnings.push(`Many slow queries detected: ${poolStatus.slowQueries}`);
    }
    
    // Memory warnings (for t2.micro with 1GB RAM)
    if (memoryUsage && memoryUsage.rss > 512) {
      warnings.push(`High memory usage: ${memoryUsage.rss}MB RSS`);
    }
    
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      health: {
        ...health,
        poolEfficiency: `${poolEfficiency}%`,
      },
      pool: {
        config: poolStatus.config,
        metrics: {
          totalConnections: poolStatus.totalConnections,
          activeConnections: poolStatus.activeConnections,
          idleConnections: poolStatus.idleConnections,
          queuedRequests: poolStatus.queuedRequests,
          connectionErrors: poolStatus.connectionErrors,
          queryCount: poolStatus.queryCount,
          slowQueries: poolStatus.slowQueries,
        },
        internalState: poolStatus.pool,
      },
      performance: {
        slowQueries: slowQueries.slice(0, 10), // Top 10 slow queries
        memoryUsage,
      },
      warnings,
      recommendations: getRecommendations(poolStatus, health, memoryUsage),
    });
  } catch (error) {
    console.error('[DB Monitor] Error:', error);
    return NextResponse.json(
      { error: 'Failed to get DB metrics', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

function getRecommendations(poolStatus: any, health: any, memoryUsage: any) {
  const recommendations = [];
  
  // Connection pool recommendations
  if (poolStatus.activeConnections >= poolStatus.config.connectionLimit * 0.8) {
    recommendations.push({
      severity: 'high',
      message: 'Connection pool near capacity',
      action: 'Consider increasing connectionLimit or optimizing query performance',
    });
  }
  
  if (poolStatus.slowQueries > 50) {
    recommendations.push({
      severity: 'high',
      message: 'Too many slow queries',
      action: 'Review slow queries and add appropriate indexes',
    });
  }
  
  if (health.latency > 200) {
    recommendations.push({
      severity: 'medium',
      message: 'High database latency',
      action: 'Check RDS instance metrics and network connectivity',
    });
  }
  
  if (memoryUsage && memoryUsage.heapUsed > 400) {
    recommendations.push({
      severity: 'medium',
      message: 'High heap memory usage',
      action: 'Consider implementing query result caching',
    });
  }
  
  if (poolStatus.connectionErrors > 5) {
    recommendations.push({
      severity: 'high',
      message: 'Multiple connection errors',
      action: 'Check database availability and network stability',
    });
  }
  
  return recommendations;
}