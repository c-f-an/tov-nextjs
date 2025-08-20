import mysql from 'mysql2/promise';

const globalForMySQL = globalThis as unknown as {
  mysqlPool: mysql.Pool | undefined;
};

export const mysqlPool =
  globalForMySQL.mysqlPool ??
  mysql.createPool({
    uri: process.env.DATABASE_URL,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

if (process.env.NODE_ENV !== 'production') globalForMySQL.mysqlPool = mysqlPool;

// Helper functions to mimic Prisma-like interface
export const db = {
  user: {
    async findUnique({ where }: { where: { email?: string; id?: number } }): Promise<any> {
      const connection = await mysqlPool.getConnection();
      try {
        let query = 'SELECT * FROM users WHERE ';
        const params: any[] = [];
        
        if (where.email) {
          query += 'email = ?';
          params.push(where.email);
        } else if (where.id) {
          query += 'id = ?';
          params.push(where.id);
        }
        
        const [rows] = await connection.execute(query, params);
        return Array.isArray(rows) && rows.length > 0 ? rows[0] : null;
      } finally {
        connection.release();
      }
    },
    
    async create({ data }: { data: any }): Promise<any> {
      const connection = await mysqlPool.getConnection();
      try {
        const fields = Object.keys(data).join(', ');
        const placeholders = Object.keys(data).map(() => '?').join(', ');
        const values = Object.values(data);
        
        const [result] = await connection.execute(
          `INSERT INTO users (${fields}) VALUES (${placeholders})`,
          values
        ) as any;
        
        // Return the created user
        return this.findUnique({ where: { id: result.insertId } });
      } finally {
        connection.release();
      }
    },
    
    async update({ where, data }: { where: { id: number }; data: any }): Promise<any> {
      const connection = await mysqlPool.getConnection();
      try {
        const setClause = Object.keys(data).map(key => `${key} = ?`).join(', ');
        const values = [...Object.values(data), where.id];
        
        await connection.execute(
          `UPDATE users SET ${setClause} WHERE id = ?`,
          values
        );
        
        return this.findUnique({ where });
      } finally {
        connection.release();
      }
    }
  }
};