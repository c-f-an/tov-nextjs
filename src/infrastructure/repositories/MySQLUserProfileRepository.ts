import { IUserProfileRepository } from '@/core/domain/repositories/IUserProfileRepository';
import { UserProfile } from '@/core/domain/entities/UserProfile';
import { query, queryOne } from '../database/mysql';
import { RowDataPacket } from 'mysql2';

interface UserProfileRow extends RowDataPacket {
  id: number;
  user_id: number;
  phone: string | null;
  address: string | null;
  created_at: Date;
  updated_at: Date;
}

export class MySQLUserProfileRepository implements IUserProfileRepository {
  async findByUserId(userId: number): Promise<UserProfile | null> {
    const row = await queryOne<UserProfileRow>(
      'SELECT * FROM user_profiles WHERE user_id = ?',
      [userId]
    );
    
    return row ? this.mapToUserProfile(row) : null;
  }

  async save(profile: UserProfile): Promise<UserProfile> {
    const { id, userId, phone, address } = profile;
    
    if (id) {
      // Update existing profile
      await query(
        `UPDATE user_profiles 
         SET phone = ?, address = ?, updated_at = NOW()
         WHERE id = ?`,
        [phone, address, id]
      );
      return profile;
    } else {
      // Insert new profile
      const result = await query<any>(
        `INSERT INTO user_profiles (user_id, phone, address, created_at, updated_at)
         VALUES (?, ?, ?, NOW(), NOW())`,
        [userId, phone, address]
      );
      
      profile.id = result.insertId;
      return profile;
    }
  }

  async delete(id: number): Promise<void> {
    await query('DELETE FROM user_profiles WHERE id = ?', [id]);
  }

  private mapToUserProfile(row: UserProfileRow): UserProfile {
    return new UserProfile(
      row.id,
      row.user_id,
      row.phone,
      row.address,
      row.created_at,
      row.updated_at
    );
  }
}