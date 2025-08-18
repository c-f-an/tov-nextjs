const { PrismaClient } = require('@prisma/client');
const dotenv = require('dotenv');

// 로컬 터널링 환경 사용시 .env.local 파일 우선 로드
dotenv.config({ path: '.env.local' });
dotenv.config();

const prisma = new PrismaClient();

async function testDatabaseConnection() {
  console.log('🔍 Testing database connection through SSH tunnel...\n');
  console.log('📌 DATABASE_URL:', process.env.DATABASE_URL?.replace(/:[^:@]+@/, ':****@') || 'Not set');
  console.log('');
  console.log('⚠️  Make sure SSH tunnel is running!');
  console.log('   Run: ./scripts/setup-ssh-tunnel.sh [SSH_HOST] [SSH_USER] [SSH_KEY_PATH]\n');

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
    console.error('\n💡 Possible solutions:');
    console.error('   1. Check if SSH tunnel is running');
    console.error('   2. Verify DATABASE_URL in .env.local');
    console.error('   3. Check tunnel port (default: 3307)');
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    console.log('\n👋 Connection closed');
  }
}

testDatabaseConnection();