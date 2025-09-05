#!/usr/bin/env node

const mysql = require('mysql2/promise');
const { performance } = require('perf_hooks');
require('dotenv').config();

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

async function debugDBPerformance() {
  console.log(`${colors.bright}${colors.cyan}=== TOV Database Performance Debugger ===${colors.reset}\n`);
  
  let pool;
  const results = {
    connection: { status: 'pending', time: 0, message: '' },
    basicQuery: { status: 'pending', time: 0, message: '' },
    tableScans: { status: 'pending', issues: [] },
    slowQueries: { status: 'pending', queries: [] },
    indexes: { status: 'pending', missing: [] },
    poolTest: { status: 'pending', concurrent: 0, errors: 0 },
  };
  
  try {
    // 1. Test Connection Speed
    console.log(`${colors.blue}1. Testing connection speed...${colors.reset}`);
    const connStart = performance.now();
    
    pool = mysql.createPool({
      host: process.env.DATABASE_HOST || 'ptax-prod-rds.cnec2c6ca6bh.ap-northeast-2.rds.amazonaws.com',
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME || 'tov_homepage',
      connectionLimit: 5,
      connectTimeout: 10000,
    });
    
    const connection = await pool.getConnection();
    const connTime = performance.now() - connStart;
    results.connection.time = connTime;
    results.connection.status = connTime < 1000 ? 'good' : connTime < 3000 ? 'warning' : 'bad';
    results.connection.message = `Connection established in ${connTime.toFixed(2)}ms`;
    
    console.log(getStatusIcon(results.connection.status) + results.connection.message);
    
    // 2. Basic Query Performance
    console.log(`\n${colors.blue}2. Testing basic query performance...${colors.reset}`);
    const queryStart = performance.now();
    await connection.query('SELECT 1');
    const queryTime = performance.now() - queryStart;
    results.basicQuery.time = queryTime;
    results.basicQuery.status = queryTime < 50 ? 'good' : queryTime < 200 ? 'warning' : 'bad';
    results.basicQuery.message = `Simple query executed in ${queryTime.toFixed(2)}ms`;
    
    console.log(getStatusIcon(results.basicQuery.status) + results.basicQuery.message);
    
    // 3. Check for Table Scans
    console.log(`\n${colors.blue}3. Checking for potential table scans...${colors.reset}`);
    const tableScanQueries = [
      { table: 'users', query: "EXPLAIN SELECT * FROM users WHERE status = 'active'" },
      { table: 'posts', query: "EXPLAIN SELECT * FROM posts WHERE status = 'published'" },
      { table: 'consultations', query: "EXPLAIN SELECT * FROM consultations WHERE status = 'pending'" },
      { table: 'donations', query: "EXPLAIN SELECT * FROM donations WHERE created_at > DATE_SUB(NOW(), INTERVAL 7 DAY)" },
    ];
    
    for (const check of tableScanQueries) {
      try {
        const [rows] = await connection.query(check.query);
        if (rows[0].type === 'ALL' || rows[0].rows > 1000) {
          results.tableScans.issues.push({
            table: check.table,
            type: rows[0].type,
            rows: rows[0].rows,
            query: check.query.replace('EXPLAIN ', ''),
          });
        }
      } catch (err) {
        // Table might not exist
      }
    }
    
    results.tableScans.status = results.tableScans.issues.length === 0 ? 'good' : 'bad';
    if (results.tableScans.issues.length > 0) {
      console.log(`${colors.red}✗ Found ${results.tableScans.issues.length} potential table scans${colors.reset}`);
      results.tableScans.issues.forEach(issue => {
        console.log(`  - ${issue.table}: ${issue.type} scan affecting ~${issue.rows} rows`);
      });
    } else {
      console.log(`${colors.green}✓ No table scan issues detected${colors.reset}`);
    }
    
    // 4. Check Slow Query Log
    console.log(`\n${colors.blue}4. Checking for slow queries...${colors.reset}`);
    try {
      const [slowLog] = await connection.query(`
        SELECT start_time, user_host, query_time, sql_text 
        FROM mysql.slow_log 
        WHERE db = ? 
        ORDER BY start_time DESC 
        LIMIT 5
      `, [process.env.DATABASE_NAME || 'tov_homepage']);
      
      results.slowQueries.queries = slowLog;
      results.slowQueries.status = slowLog.length === 0 ? 'good' : 'warning';
      
      if (slowLog.length > 0) {
        console.log(`${colors.yellow}⚠ Found ${slowLog.length} slow queries${colors.reset}`);
        slowLog.forEach(q => {
          console.log(`  - ${q.query_time}s: ${q.sql_text.substring(0, 80)}...`);
        });
      } else {
        console.log(`${colors.green}✓ No slow queries found${colors.reset}`);
      }
    } catch (err) {
      console.log(`${colors.yellow}⚠ Cannot access slow query log (requires permissions)${colors.reset}`);
    }
    
    // 5. Check Indexes
    console.log(`\n${colors.blue}5. Checking indexes on frequently queried columns...${colors.reset}`);
    const indexChecks = [
      { table: 'users', column: 'status' },
      { table: 'users', column: 'email' },
      { table: 'posts', column: 'status' },
      { table: 'posts', column: 'category_id' },
      { table: 'posts', column: 'created_at' },
      { table: 'consultations', column: 'user_id' },
      { table: 'consultations', column: 'status' },
      { table: 'donations', column: 'user_id' },
      { table: 'donations', column: 'created_at' },
    ];
    
    for (const check of indexChecks) {
      try {
        const [indexes] = await connection.query(
          `SHOW INDEXES FROM ${check.table} WHERE Column_name = ?`,
          [check.column]
        );
        
        if (indexes.length === 0) {
          results.indexes.missing.push(`${check.table}.${check.column}`);
        }
      } catch (err) {
        // Table might not exist
      }
    }
    
    results.indexes.status = results.indexes.missing.length === 0 ? 'good' : 'warning';
    if (results.indexes.missing.length > 0) {
      console.log(`${colors.yellow}⚠ Missing indexes on ${results.indexes.missing.length} columns${colors.reset}`);
      results.indexes.missing.forEach(col => {
        console.log(`  - ${col}`);
      });
    } else {
      console.log(`${colors.green}✓ All checked columns have indexes${colors.reset}`);
    }
    
    // 6. Connection Pool Stress Test
    console.log(`\n${colors.blue}6. Testing connection pool under load...${colors.reset}`);
    const poolTestStart = performance.now();
    const concurrentQueries = 10;
    const queries = [];
    
    for (let i = 0; i < concurrentQueries; i++) {
      queries.push(
        pool.query('SELECT COUNT(*) as count FROM posts').catch(err => {
          results.poolTest.errors++;
          return null;
        })
      );
    }
    
    await Promise.all(queries);
    const poolTestTime = performance.now() - poolTestStart;
    results.poolTest.concurrent = concurrentQueries;
    results.poolTest.status = results.poolTest.errors === 0 && poolTestTime < 1000 ? 'good' : 'warning';
    results.poolTest.message = `Executed ${concurrentQueries} concurrent queries in ${poolTestTime.toFixed(2)}ms with ${results.poolTest.errors} errors`;
    
    console.log(getStatusIcon(results.poolTest.status) + results.poolTest.message);
    
    // Release connection
    connection.release();
    
    // Summary and Recommendations
    console.log(`\n${colors.bright}${colors.cyan}=== Performance Summary ===${colors.reset}`);
    console.log(`Connection Time: ${getStatusBadge(results.connection.status)} ${results.connection.time.toFixed(2)}ms`);
    console.log(`Query Latency: ${getStatusBadge(results.basicQuery.status)} ${results.basicQuery.time.toFixed(2)}ms`);
    console.log(`Table Scans: ${getStatusBadge(results.tableScans.status)} ${results.tableScans.issues.length} issues`);
    console.log(`Missing Indexes: ${getStatusBadge(results.indexes.status)} ${results.indexes.missing.length} columns`);
    console.log(`Pool Performance: ${getStatusBadge(results.poolTest.status)} ${results.poolTest.errors} errors`);
    
    console.log(`\n${colors.bright}${colors.cyan}=== Recommendations ===${colors.reset}`);
    
    // Generate recommendations based on results
    const recommendations = [];
    
    if (results.connection.status !== 'good') {
      recommendations.push({
        priority: 'HIGH',
        issue: 'Slow initial connection',
        solution: 'Check network latency between EC2 and RDS. Ensure they\'re in the same VPC/AZ.',
      });
    }
    
    if (results.tableScans.issues.length > 0) {
      recommendations.push({
        priority: 'HIGH',
        issue: 'Table scans detected',
        solution: 'Add indexes on status columns:\n' + 
          results.tableScans.issues.map(i => `  ALTER TABLE ${i.table} ADD INDEX idx_status (status);`).join('\n'),
      });
    }
    
    if (results.indexes.missing.length > 0) {
      recommendations.push({
        priority: 'MEDIUM',
        issue: 'Missing indexes on frequently queried columns',
        solution: 'Consider adding indexes:\n' +
          results.indexes.missing.map(col => {
            const [table, column] = col.split('.');
            return `  ALTER TABLE ${table} ADD INDEX idx_${column} (${column});`;
          }).join('\n'),
      });
    }
    
    if (results.poolTest.errors > 0) {
      recommendations.push({
        priority: 'HIGH',
        issue: 'Connection pool errors under load',
        solution: 'Reduce connectionLimit or optimize query performance. Current limit may be too high for t2.micro.',
      });
    }
    
    // Always recommend these optimizations
    recommendations.push({
      priority: 'MEDIUM',
      issue: 'General optimization',
      solution: 'Enable query caching:\n  SET GLOBAL query_cache_size = 67108864;\n  SET GLOBAL query_cache_type = ON;',
    });
    
    recommendations.forEach(rec => {
      console.log(`\n${getPriorityColor(rec.priority)}[${rec.priority}]${colors.reset} ${rec.issue}`);
      console.log(`Solution: ${rec.solution}`);
    });
    
  } catch (error) {
    console.error(`\n${colors.red}Error during debugging:${colors.reset}`, error);
  } finally {
    if (pool) {
      await pool.end();
    }
  }
}

function getStatusIcon(status) {
  switch (status) {
    case 'good': return `${colors.green}✓ ${colors.reset}`;
    case 'warning': return `${colors.yellow}⚠ ${colors.reset}`;
    case 'bad': return `${colors.red}✗ ${colors.reset}`;
    default: return '? ';
  }
}

function getStatusBadge(status) {
  switch (status) {
    case 'good': return `${colors.green}[GOOD]${colors.reset}`;
    case 'warning': return `${colors.yellow}[WARN]${colors.reset}`;
    case 'bad': return `${colors.red}[BAD]${colors.reset}`;
    default: return '[UNKNOWN]';
  }
}

function getPriorityColor(priority) {
  switch (priority) {
    case 'HIGH': return colors.red;
    case 'MEDIUM': return colors.yellow;
    case 'LOW': return colors.blue;
    default: return colors.reset;
  }
}

// Run the debugger
debugDBPerformance().catch(console.error);