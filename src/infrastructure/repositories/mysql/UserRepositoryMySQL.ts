import { injectable } from 'tsyringe';
import { User } from '@/core/domain/entities/User';
import { IUserRepository } from '@/core/domain/repositories/IUserRepository';
import { getConnection } from '@/infrastructure/database/mysql';

@injectable()
export class UserRepositoryMySQL implements IUserRepository {
  // 중앙 집중식 싱글톤 pool 사용 - 새 풀 생성하지 않음

  private toDomain(dbUser: any): User {
    return new User(
      dbUser.id,
      dbUser.email,
      dbUser.name,
      dbUser.role as any,
      dbUser.status as any,
      (dbUser.login_type || 'email') as any,
      dbUser.user_type ?? 0,
      dbUser.username || undefined,
      dbUser.password || undefined,
      dbUser.phone || undefined,
      dbUser.email_verified_at ? new Date(dbUser.email_verified_at) : undefined,
      dbUser.remember_token || undefined,
      dbUser.avatar_url || undefined,
      dbUser.last_login_at ? new Date(dbUser.last_login_at) : undefined,
      dbUser.last_login_ip || undefined,
      dbUser.created_at ? new Date(dbUser.created_at) : new Date(),
      dbUser.updated_at ? new Date(dbUser.updated_at) : new Date()
    );
  }

  async findById(id: number): Promise<User | null> {
    const connection = await getConnection();
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
    const connection = await getConnection();
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
    const connection = await getConnection();
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
    const connection = await getConnection();
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

        return this.toDomain({ ...user, id: result.insertId, login_type: user.loginType, user_type: user.userType, email_verified_at: user.emailVerifiedAt, remember_token: user.rememberToken, avatar_url: user.avatarUrl, last_login_at: user.lastLoginAt, last_login_ip: user.lastLoginIp, created_at: user.createdAt, updated_at: user.updatedAt });
      }
    } finally {
      connection.release();
    }
  }

  async update(user: User): Promise<void> {
    const connection = await getConnection();
    try {
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
    } finally {
      connection.release();
    }
  }

  async findAll(): Promise<User[]> {
    const connection = await getConnection();
    try {
      const [rows] = await connection.execute('SELECT * FROM users');
      return (rows as any[]).map(row => this.toDomain(row));
    } finally {
      connection.release();
    }
  }

  async delete(id: number): Promise<void> {
    const connection = await getConnection();
    try {
      await connection.execute('DELETE FROM users WHERE id = ?', [id]);
    } finally {
      connection.release();
    }
  }
}
