const { PrismaClient } = require('@prisma/client');
const dotenv = require('dotenv');

dotenv.config();

const prisma = new PrismaClient();

async function checkDatabaseData() {
  console.log('🔍 Checking database data...\n');

  try {
    await prisma.$connect();
    console.log('✅ Connected to database\n');

    // Check users
    const userCount = await prisma.user.count();
    console.log(`👥 Users: ${userCount}`);
    if (userCount > 0) {
      const users = await prisma.user.findMany({ take: 3 });
      console.log('   Sample users:');
      users.forEach(user => {
        console.log(`   - ${user.email} (${user.name})`);
      });
    }

    // Check categories
    const categoryCount = await prisma.category.count();
    console.log(`\n📁 Categories: ${categoryCount}`);
    if (categoryCount > 0) {
      const categories = await prisma.category.findMany({ take: 5 });
      console.log('   Sample categories:');
      categories.forEach(cat => {
        console.log(`   - ${cat.name} (${cat.slug})`);
      });
    }

    // Check posts
    const postCount = await prisma.post.count();
    console.log(`\n📝 Posts: ${postCount}`);
    if (postCount > 0) {
      const posts = await prisma.post.findMany({ take: 3, orderBy: { createdAt: 'desc' } });
      console.log('   Recent posts:');
      posts.forEach(post => {
        console.log(`   - ${post.title} (views: ${post.views})`);
      });
    }

    // Check consultations
    const consultationCount = await prisma.consultation.count();
    console.log(`\n💬 Consultations: ${consultationCount}`);

    // Check donations
    const donationCount = await prisma.donation.count();
    console.log(`\n💰 Donations: ${donationCount}`);

    // Show all tables
    const tables = await prisma.$queryRaw`
      SELECT table_name, table_rows 
      FROM information_schema.tables 
      WHERE table_schema = DATABASE() 
      ORDER BY table_name
    `;
    
    console.log('\n📊 All tables in database:');
    tables.forEach(table => {
      console.log(`   - ${table.TABLE_NAME} (rows: ${table.TABLE_ROWS || 0})`);
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    console.log('\n✅ Done');
  }
}

checkDatabaseData();