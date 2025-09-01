import { IUserRepository } from '@/core/domain/repositories/IUserRepository';
import { User } from '@/core/domain/entities/User';
import { query, queryOne, withTransaction } from '../database/mysql';
import { RowDataPacket } from 'mysql2';

interface UserRow extends RowDataPacket {
  id: number;
  email: string;
  password: string;
  name: string;
  role: 'admin' | 'user';
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export class MySQLUserRepository implements IUserRepository {
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
    
    return row ? this.mapToUser(row) : null;
  }

  async save(user: User): Promise<User> {
    const { id, email, password, name, role, isActive } = user;
    
    if (id) {
      // Update existing user
      await query(
        `UPDATE users 
         SET email = ?, password = ?, name = ?, role = ?, is_active = ?, updated_at = NOW()
         WHERE id = ?`,
        [email, password, name, role, isActive, id]
      );
      return user;
    } else {
      // Insert new user
      const result = await query<any>(
        `INSERT INTO users (email, password, name, role, is_active, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
        [email, password, name, role, isActive]
      );
      
      user.id = result.insertId;
      return user;
    }
  }

  async delete(id: number): Promise<void> {
    await query('DELETE FROM users WHERE id = ?', [id]);
  }

  private mapToUser(row: UserRow): User {
    return new User(
      row.id,
      row.email,
      row.password,
      row.name,
      row.role,
      row.is_active,
      row.created_at,
      row.updated_at
    );
  }
}