const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const readline = require('readline');

dotenv.config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function connectToMySQL() {
  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    console.error('❌ DATABASE_URL not found in .env file');
    process.exit(1);
  }

  try {
    const url = new URL(databaseUrl);
    const config = {
      host: url.hostname,
      port: url.port || 3306,
      user: url.username,
      password: url.password,
      database: url.pathname.slice(1)
    };

    console.log('🔗 Connecting to MySQL...');
    console.log(`📍 Host: ${config.host}:${config.port}`);
    console.log(`👤 User: ${config.user}`);
    console.log(`📁 Database: ${config.database}\n`);

    const connection = await mysql.createConnection(config);
    console.log('✅ Connected to MySQL successfully!\n');
    console.log('📝 You can now execute SQL queries. Type "exit" to quit.\n');

    const executeQuery = async () => {
      rl.question('mysql> ', async (query) => {
        if (query.toLowerCase() === 'exit' || query.toLowerCase() === 'quit') {
          console.log('\n👋 Closing connection...');
          await connection.end();
          rl.close();
          process.exit(0);
        }

        if (query.trim()) {
          try {
            const [results] = await connection.execute(query);
            console.log('\nResults:');
            console.table(results);
            console.log('');
          } catch (error) {
            console.error('❌ Error:', error.message, '\n');
          }
        }

        executeQuery();
      });
    };

    executeQuery();

  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    process.exit(1);
  }
}

connectToMySQL();