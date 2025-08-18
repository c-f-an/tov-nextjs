const { PrismaClient } = require('@prisma/client');
const dotenv = require('dotenv');

dotenv.config();

const prisma = new PrismaClient();

async function testDatabaseConnection() {
  console.log('🔍 Testing database connection...\n');
  console.log('📌 DATABASE_URL:', process.env.DATABASE_URL?.replace(/:[^:@]+@/, ':****@') || 'Not set');
  console.log('');

  try {
    await prisma.$connect();
    console.log('✅ Database connection successful!\n');

    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('✅ Query test successful:', result);
    
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = DATABASE() 
      ORDER BY table_name
    `;
    
    console.log('\n📊 Available tables:');
    tables.forEach(table => {
      console.log(`   - ${table.table_name}`);
    });

  } catch (error) {
    console.error('❌ Database connection failed!\n');
    console.error('Error details:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    console.log('\n👋 Connection closed');
  }
}

testDatabaseConnection();