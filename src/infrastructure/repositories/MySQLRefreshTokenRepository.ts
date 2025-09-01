import { IRefreshTokenRepository } from '@/core/domain/repositories/IRefreshTokenRepository';
import { RefreshToken } from '@/core/domain/entities/RefreshToken';
import { query, queryOne } from '../database/mysql';
import { RowDataPacket } from 'mysql2';

interface RefreshTokenRow extends RowDataPacket {
  id: number;
  token: string;
  user_id: number;
  expires_at: Date;
  created_at: Date;
}

export class MySQLRefreshTokenRepository implements IRefreshTokenRepository {
  async findByToken(token: string): Promise<RefreshToken | null> {
    const row = await queryOne<RefreshTokenRow>(
      'SELECT * FROM refresh_tokens WHERE token = ?',
      [token]
    );
    
    return row ? this.mapToRefreshToken(row) : null;
  }

  async save(refreshToken: RefreshToken): Promise<RefreshToken> {
    const { id, token, userId, expiresAt } = refreshToken;
    
    if (id) {
      // Update existing token
      await query(
        `UPDATE refresh_tokens 
         SET token = ?, expires_at = ?
         WHERE id = ?`,
        [token, expiresAt, id]
      );
      return refreshToken;
    } else {
      // Insert new token
      const result = await query<any>(
        `INSERT INTO refresh_tokens (token, user_id, expires_at, created_at)
         VALUES (?, ?, ?, NOW())`,
        [token, userId, expiresAt]
      );
      
      refreshToken.id = result.insertId;
      return refreshToken;
    }
  }

  async delete(id: number): Promise<void> {
    await query('DELETE FROM refresh_tokens WHERE id = ?', [id]);
  }

  async deleteByUserId(userId: number): Promise<void> {
    await query('DELETE FROM refresh_tokens WHERE user_id = ?', [userId]);
  }

  async deleteExpired(): Promise<void> {
    await query('DELETE FROM refresh_tokens WHERE expires_at < NOW()');
  }

  private mapToRefreshToken(row: RefreshTokenRow): RefreshToken {
    return new RefreshToken(
      row.id,
      row.token,
      row.user_id,
      row.expires_at,
      row.created_at
    );
  }
}