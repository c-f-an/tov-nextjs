const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

async function testMySQLAuth() {
  console.log('🔍 Testing MySQL authentication...\n');

  const databaseUrl = process.env.DATABASE_URL;
  const url = new URL(databaseUrl);
  
  const config = {
    host: url.hostname,
    port: url.port || 3306,
    user: url.username,
    password: url.password,
    database: url.pathname.slice(1)
  };

  try {
    console.log('📌 Connecting with sha256_password plugin support...');
    const connection = await mysql.createConnection(config);
    
    console.log('✅ Connection successful!\n');
    
    const [rows] = await connection.execute('SELECT USER() as user, DATABASE() as db');
    console.log('Current user:', rows[0].user);
    console.log('Current database:', rows[0].db);
    
    const [authRows] = await connection.execute(`
      SELECT user, host, plugin 
      FROM mysql.user 
      WHERE user = ?
    `, [config.user]);
    
    if (authRows.length > 0) {
      console.log('\nAuthentication info:');
      console.log('Plugin:', authRows[0].plugin);
    }
    
    await connection.end();
    console.log('\n✅ Test completed successfully');
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.error('\nError code:', error.code);
    
    if (error.message.includes('sha256_password')) {
      console.log('\n💡 Solution: The MySQL server is using sha256_password authentication.');
      console.log('   Options:');
      console.log('   1. Ask the DBA to change the user to mysql_native_password');
      console.log('   2. Update mysql2 package to latest version');
      console.log('   3. Use a different MySQL client library');
    }
  }
}

testMySQLAuth();