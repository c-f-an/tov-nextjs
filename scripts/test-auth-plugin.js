const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

async function testAuthPlugin() {
  console.log('🔍 Testing MySQL authentication directly...\n');

  const databaseUrl = process.env.DATABASE_URL;
  const url = new URL(databaseUrl);
  
  // Test with different auth plugin configurations
  const configs = [
    {
      name: 'Default connection',
      config: {
        host: url.hostname,
        port: parseInt(url.port) || 3306,
        user: url.username,
        password: url.password,
        database: url.pathname.slice(1)
      }
    },
    {
      name: 'With ssl disabled',
      config: {
        host: url.hostname,
        port: parseInt(url.port) || 3306,
        user: url.username,
        password: url.password,
        database: url.pathname.slice(1),
        ssl: {
          rejectUnauthorized: false
        }
      }
    },
    {
      name: 'With insecureAuth',
      config: {
        host: url.hostname,
        port: parseInt(url.port) || 3306,
        user: url.username,
        password: url.password,
        database: url.pathname.slice(1),
        insecureAuth: true
      }
    }
  ];

  for (const { name, config } of configs) {
    console.log(`\n📌 Testing: ${name}`);
    try {
      const connection = await mysql.createConnection(config);
      console.log('   ✅ Connection successful!');
      
      const [rows] = await connection.execute('SELECT 1 as test');
      console.log('   ✅ Query successful:', rows);
      
      await connection.end();
    } catch (error) {
      console.log('   ❌ Failed:', error.message);
    }
  }
  
  console.log('\n📝 Summary:');
  console.log('   - mysql2 supports sha256_password');
  console.log('   - The issue might be in Prisma\'s MySQL driver');
  console.log('   - Consider using a connection pool or proxy');
}

testAuthPlugin();