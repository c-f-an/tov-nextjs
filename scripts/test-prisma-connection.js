const { PrismaClient } = require('@prisma/client');
const dotenv = require('dotenv');

dotenv.config();

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

async function testPrismaConnection() {
  console.log('🔍 Testing Prisma connection...\n');
  console.log('📌 DATABASE_URL:', process.env.DATABASE_URL?.replace(/:[^:@]+@/, ':****@') || 'Not set');
  console.log('');

  try {
    // Test basic connection
    await prisma.$connect();
    console.log('✅ Prisma connected successfully!\n');

    // Test raw query
    const result = await prisma.$queryRaw`SELECT VERSION() as version, USER() as user`;
    console.log('MySQL Version:', result[0].version);
    console.log('Connected as:', result[0].user);
    console.log('');

    // Test creating a user
    console.log('📝 Testing user creation...');
    const testUser = await prisma.user.create({
      data: {
        email: 'test@example.com',
        password: 'hashed_password',
        name: 'Test User',
        role: 'USER',
        status: 'ACTIVE'
      }
    });
    console.log('✅ User created:', testUser.email);

    // Clean up
    await prisma.user.delete({
      where: { id: testUser.id }
    });
    console.log('🧹 Test user cleaned up');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('\nFull error:', error);
    
    if (error.message.includes('sha256_password')) {
      console.log('\n💡 Authentication plugin issue detected');
      console.log('   The MySQL server is using sha256_password authentication');
    }
  } finally {
    await prisma.$disconnect();
    console.log('\n👋 Disconnected');
  }
}

testPrismaConnection();