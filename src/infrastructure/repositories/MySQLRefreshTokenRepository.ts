import { IRefreshTokenRepository } from '@/core/domain/repositories/IRefreshTokenRepository';
import { RefreshToken } from '@/core/domain/entities/RefreshToken';
import { query, queryOne } from '../database/mysql';
import { RowDataPacket } from 'mysql2';

interface RefreshTokenRow extends RowDataPacket {
  id: number;
  token_hash: string;
  user_id: number;
  device_info?: string | null;
  ip_address?: string | null;
  expires_at: Date;
  revoked_at?: Date | null;
  revoked_reason?: string | null;
  created_at: Date;
  updated_at: Date;
}

export class MySQLRefreshTokenRepository implements IRefreshTokenRepository {
  async findByTokenHash(tokenHash: string): Promise<RefreshToken | null> {
    const row = await queryOne<RefreshTokenRow>(
      'SELECT * FROM refresh_tokens WHERE token_hash = ? AND revoked_at IS NULL AND expires_at > NOW()',
      [tokenHash]
    );
    
    return row ? this.mapToRefreshToken(row) : null;
  }

  async findByUserId(userId: number): Promise<RefreshToken[]> {
    const rows = await query<RefreshTokenRow>(
      'SELECT * FROM refresh_tokens WHERE user_id = ? AND revoked_at IS NULL AND expires_at > NOW()',
      [userId]
    );
    
    return rows.map(row => this.mapToRefreshToken(row));
  }

  async save(refreshToken: RefreshToken): Promise<void> {
    if (refreshToken.id) {
      // Update existing token
      await query(
        `UPDATE refresh_tokens 
         SET token_hash = ?, expires_at = ?, device_info = ?, ip_address = ?, updated_at = NOW()
         WHERE id = ?`,
        [refreshToken.tokenHash, refreshToken.expiresAt, refreshToken.deviceInfo, refreshToken.ipAddress, refreshToken.id]
      );
    } else {
      // Insert new token
      const result = await query<any>(
        `INSERT INTO refresh_tokens (token_hash, user_id, device_info, ip_address, expires_at, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
        [refreshToken.tokenHash, refreshToken.userId, refreshToken.deviceInfo, refreshToken.ipAddress, refreshToken.expiresAt]
      );
      
    }
  }

  async update(refreshToken: RefreshToken): Promise<void> {
    await query(
      `UPDATE refresh_tokens 
       SET token_hash = ?, expires_at = ?, device_info = ?, ip_address = ?, 
           revoked_at = ?, revoked_reason = ?, updated_at = NOW()
       WHERE id = ?`,
      [
        refreshToken.tokenHash, refreshToken.expiresAt, refreshToken.deviceInfo, 
        refreshToken.ipAddress, refreshToken.revokedAt, refreshToken.revokedReason, 
        refreshToken.id
      ]
    );
  }

  async deleteByTokenHash(tokenHash: string): Promise<void> {
    await query('DELETE FROM refresh_tokens WHERE token_hash = ?', [tokenHash]);
  }

  async deleteByUserId(userId: number): Promise<void> {
    await query('DELETE FROM refresh_tokens WHERE user_id = ?', [userId]);
  }

  async deleteExpiredTokens(): Promise<void> {
    await query('DELETE FROM refresh_tokens WHERE expires_at < NOW()');
  }

  private mapToRefreshToken(row: RefreshTokenRow): RefreshToken {
    return new RefreshToken(
      row.id,
      row.user_id,
      row.token_hash,
      row.expires_at,
      row.device_info,
      row.ip_address,
      row.revoked_at,
      row.revoked_reason,
      row.created_at,
      row.updated_at
    );
  }
}