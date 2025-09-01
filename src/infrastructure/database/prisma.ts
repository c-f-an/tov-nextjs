import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Create Prisma client with optimized connection pool
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;


// 연결 풀 워밍업
async function warmupPool() {
  if (typeof window === 'undefined') {
    const promises = [];
    // Prisma 연결 풀 워밍업
    for (let i = 0; i < 5; i++) {
      promises.push(prisma.$queryRaw`SELECT 1`);
    }
    try {
      await Promise.all(promises);
      console.log('[Database] Connection pool warmed up');
    } catch (error) {
      console.error('[Database] Pool warmup failed:', error);
    }
  }
}

// 앱 시작 시 실행
if (typeof window === 'undefined') {
  warmupPool().catch(console.error);
}

// Keep-Alive functionality
if (typeof window === 'undefined') { // Only run on server-side
  const keepAliveInterval = setInterval(async () => {
    try {
      // Prisma keep-alive
      await prisma.$queryRaw`SELECT 1`;
      console.log(`[${new Date().toISOString()}] Prisma DB Keep-alive OK`);
    } catch (error) {
      console.error('Keep-alive failed:', error);
    }
  }, 5 * 60 * 1000); // 5분마다

  // Cleanup on process termination
  if (process.env.NODE_ENV !== 'production') {
    process.on('SIGTERM', () => {
      clearInterval(keepAliveInterval);
    });
    process.on('SIGINT', () => {
      clearInterval(keepAliveInterval);
    });
  }
}