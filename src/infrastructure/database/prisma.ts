import { PrismaClient } from '@prisma/client';
import mysql from 'mysql2/promise';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  mysqlPool: mysql.Pool | undefined;
};

// Try to create MySQL pool for sha256_password support
let mysqlPool: mysql.Pool | undefined;
try {
  const databaseUrl = process.env.DATABASE_URL || '';
  if (databaseUrl.includes('localhost:3307')) {
    // Create a mysql2 pool for local development with sha256_password
    globalForPrisma.mysqlPool = globalForPrisma.mysqlPool ?? mysql.createPool({
      uri: databaseUrl,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
    mysqlPool = globalForPrisma.mysqlPool;
  }
} catch (error) {
  console.error('Failed to create MySQL pool:', error);
}

// Create Prisma client
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Export mysql pool for direct queries if needed
export { mysqlPool };