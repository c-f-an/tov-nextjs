import { IUserRepository } from '@/core/domain/repositories/IUserRepository';
import { User, UserStatus, LoginType, UserRole, UserType } from '@/core/domain/entities/User';
import { query, queryOne, withTransaction } from '../database/mysql';
import { RowDataPacket } from 'mysql2';

interface UserRow extends RowDataPacket {
  id: number;
  username?: string | null;
  email: string;
  password: string;
  name: string;
  phone?: string | null;
  role: string;
  status: string;
  user_type: number;
  email_verified_at?: Date | null;
  remember_token?: string | null;
  login_type: string;
  avatar_url?: string | null;
  last_login_at?: Date | null;
  last_login_ip?: string | null;
  created_at: Date;
  updated_at: Date;
}

export class MySQLUserRepository implements IUserRepository {
  private static instance: MySQLUserRepository;

  private constructor() {}

  static getInstance(): MySQLUserRepository {
    if (!MySQLUserRepository.instance) {
      MySQLUserRepository.instance = new MySQLUserRepository();
    }
    return MySQLUserRepository.instance;
  }

  async findById(id: number): Promise<User | null> {
    const row = await queryOne<UserRow>(
      'SELECT * FROM users WHERE id = ?',
      [id]
    );
    
    return row ? this.mapToUser(row) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const row = await queryOne<UserRow>(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    
    console.log('Raw DB row:', row);
    
    return row ? this.mapToUser(row) : null;
  }

  async save(user: User): Promise<User> {
    if (user.id) {
      // Update existing user
      await query(
        `UPDATE users
         SET username = ?, email = ?, password = ?, name = ?, phone = ?,
             role = ?, status = ?, user_type = ?, email_verified_at = ?, remember_token = ?,
             login_type = ?, avatar_url = ?, last_login_at = ?, last_login_ip = ?,
             updated_at = NOW()
         WHERE id = ?`,
        [
          user.username, user.email, user.password, user.name, user.phone,
          user.role, user.status, user.userType, user.emailVerifiedAt, user.rememberToken,
          user.loginType, user.avatarUrl, user.lastLoginAt, user.lastLoginIp,
          user.id
        ]
      );
      return user;
    } else {
      // Insert new user
      const result = await query<any>(
        `INSERT INTO users (username, email, password, name, phone, role, status, user_type,
                           email_verified_at, remember_token, login_type, avatar_url,
                           last_login_at, last_login_ip, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [
          user.username, user.email, user.password, user.name, user.phone,
          user.role, user.status, user.userType, user.emailVerifiedAt, user.rememberToken,
          user.loginType, user.avatarUrl, user.lastLoginAt, user.lastLoginIp
        ]
      );
      
      return new User(
        result.insertId,
        user.email,
        user.name,
        user.role,
        user.status,
        user.loginType,
        user.userType,
        user.username,
        user.password,
        user.phone,
        user.emailVerifiedAt,
        user.rememberToken,
        user.avatarUrl,
        user.lastLoginAt,
        user.lastLoginIp,
        user.createdAt,
        user.updatedAt
      );
    }
  }

  async update(user: User): Promise<void> {
    await query(
      `UPDATE users
       SET username = ?, email = ?, password = ?, name = ?, phone = ?,
           role = ?, status = ?, user_type = ?, email_verified_at = ?, remember_token = ?,
           login_type = ?, avatar_url = ?, last_login_at = ?, last_login_ip = ?,
           updated_at = NOW()
       WHERE id = ?`,
      [
        user.username, user.email, user.password, user.name, user.phone,
        user.role, user.status, user.userType, user.emailVerifiedAt, user.rememberToken,
        user.loginType, user.avatarUrl, user.lastLoginAt, user.lastLoginIp,
        user.id
      ]
    );
  }

  async delete(id: number): Promise<void> {
    await query('DELETE FROM users WHERE id = ?', [id]);
  }

  private mapToUser(row: UserRow): User {
    console.log('Mapping user from DB:', { id: row.id, email: row.email, role: row.role });
    return new User(
      row.id,
      row.email,
      row.name,
      row.role as any, // Will be converted to UserRole enum
      row.status as any, // Will be converted to UserStatus enum
      row.login_type as any, // Will be converted to LoginType enum
      row.user_type as UserType ?? UserType.NORMAL,
      row.username,
      row.password,
      row.phone,
      row.email_verified_at,
      row.remember_token,
      row.avatar_url,
      row.last_login_at,
      row.last_login_ip,
      row.created_at,
      row.updated_at
    );
  }
}