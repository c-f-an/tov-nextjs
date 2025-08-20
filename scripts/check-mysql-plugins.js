const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

async function checkMySQLPlugins() {
  console.log('🔍 Checking MySQL authentication plugins...\n');
  
  // Check if mysql2 supports sha256_password
  console.log('📦 mysql2 version:', require('mysql2/package.json').version);
  console.log('\n📌 Available auth plugins in mysql2:');
  
  const authPlugins = mysql.authPlugins || {};
  for (const [name, plugin] of Object.entries(authPlugins)) {
    console.log(`   - ${name}: ${typeof plugin}`);
  }
  
  // Create connection with mysql_native_password request
  const databaseUrl = process.env.DATABASE_URL;
  const url = new URL(databaseUrl);
  
  const config = {
    host: url.hostname,
    port: url.port || 3306,
    user: url.username,
    password: url.password,
    database: url.pathname.slice(1),
    ssl: {
      rejectUnauthorized: false
    }
  };
  
  console.log('\n🔧 Attempting connection to MySQL...');
  
  const connection = mysql.createConnection(config);
  
  connection.connect((err) => {
    if (err) {
      console.error('❌ Connection error:', err.message);
      console.error('   Error code:', err.code);
      console.error('   Plugin requested:', err.pluginName);
      
      if (err.message.includes('sha256_password')) {
        console.log('\n💡 Solutions:');
        console.log('   1. Install mysql2 with sha256 support:');
        console.log('      npm install mysql2@latest');
        console.log('   2. Or change user authentication in MySQL:');
        console.log('      ALTER USER \'tov-client\'@\'%\' IDENTIFIED WITH mysql_native_password BY \'A0oMDPDoRn3H6Y0\';');
        console.log('   3. Or use a connection pooling service that handles auth');
      }
    } else {
      console.log('✅ Connected successfully!');
      
      connection.query('SELECT plugin FROM mysql.user WHERE user = ?', [config.user], (err, results) => {
        if (!err && results.length > 0) {
          console.log(`\n📌 User '${config.user}' is using plugin: ${results[0].plugin}`);
        }
        connection.end();
      });
    }
  });
}

checkMySQLPlugins();