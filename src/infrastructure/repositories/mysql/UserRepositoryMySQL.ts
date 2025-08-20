import { injectable } from 'tsyringe';
import mysql from 'mysql2/promise';
import { User } from '@/core/domain/entities/User';
import { IUserRepository } from '@/core/domain/repositories/IUserRepository';

@injectable()
export class UserRepositoryMySQL implements IUserRepository {
  private pool: mysql.Pool;

  constructor() {
    this.pool = mysql.createPool({
      uri: process.env.DATABASE_URL,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
  }

  private toDomain(dbUser: any): User {
    return new User(
      dbUser.id,
      dbUser.username || undefined,
      dbUser.email,
      dbUser.password,
      dbUser.name,
      dbUser.phone || undefined,
      dbUser.email_verified_at ? new Date(dbUser.email_verified_at) : undefined,
      dbUser.remember_token || undefined,
      dbUser.login_type || 'EMAIL',
      dbUser.avatar_url || undefined,
      dbUser.last_login_at ? new Date(dbUser.last_login_at) : undefined,
      dbUser.last_login_ip || undefined,
      dbUser.created_at ? new Date(dbUser.created_at) : new Date(),
      dbUser.updated_at ? new Date(dbUser.updated_at) : new Date()
    );
  }

  async findById(id: number): Promise<User | null> {
    const connection = await this.pool.getConnection();
    try {
      const [rows] = await connection.execute(
        'SELECT * FROM users WHERE id = ?',
        [id]
      );
      const users = rows as any[];
      return users.length > 0 ? this.toDomain(users[0]) : null;
    } finally {
      connection.release();
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    const connection = await this.pool.getConnection();
    try {
      const [rows] = await connection.execute(
        'SELECT * FROM users WHERE email = ?',
        [email]
      );
      const users = rows as any[];
      return users.length > 0 ? this.toDomain(users[0]) : null;
    } finally {
      connection.release();
    }
  }

  async findByUsername(username: string): Promise<User | null> {
    const connection = await this.pool.getConnection();
    try {
      const [rows] = await connection.execute(
        'SELECT * FROM users WHERE username = ?',
        [username]
      );
      const users = rows as any[];
      return users.length > 0 ? this.toDomain(users[0]) : null;
    } finally {
      connection.release();
    }
  }

  async save(user: User): Promise<User> {
    const connection = await this.pool.getConnection();
    try {
      if (user.id) {
        // Update existing user
        await connection.execute(
          `UPDATE users SET 
            username = ?, email = ?, password = ?, name = ?, 
            phone = ?, email_verified_at = ?, remember_token = ?, 
            login_type = ?, avatar_url = ?, last_login_at = ?, 
            last_login_ip = ?, updated_at = NOW()
          WHERE id = ?`,
          [
            user.username, user.email, user.password, user.name,
            user.phone, user.emailVerifiedAt, user.rememberToken,
            user.loginType, user.avatarUrl, user.lastLoginAt,
            user.lastLoginIp, user.id
          ]
        );
        return user;
      } else {
        // Create new user
        const [result] = await connection.execute(
          `INSERT INTO users (
            username, email, password, name, phone, 
            email_verified_at, remember_token, login_type, 
            avatar_url, last_login_at, last_login_ip, 
            created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
          [
            user.username, user.email, user.password, user.name,
            user.phone, user.emailVerifiedAt, user.rememberToken,
            user.loginType || 'EMAIL', user.avatarUrl, user.lastLoginAt,
            user.lastLoginIp
          ]
        ) as any;
        
        user.id = result.insertId;
        return user;
      }
    } finally {
      connection.release();
    }
  }

  async delete(id: number): Promise<void> {
    const connection = await this.pool.getConnection();
    try {
      await connection.execute('DELETE FROM users WHERE id = ?', [id]);
    } finally {
      connection.release();
    }
  }
}