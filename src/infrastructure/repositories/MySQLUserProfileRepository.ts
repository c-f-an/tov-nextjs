import { IUserProfileRepository } from '@/core/domain/repositories/IUserProfileRepository';
import { UserProfile } from '@/core/domain/entities/UserProfile';
import { query, queryOne } from '../database/mysql';
import { RowDataPacket } from 'mysql2';

interface UserProfileRow extends RowDataPacket {
  id: number;
  user_id: number;
  church_name: string | null;
  position: string | null;
  denomination: string | null;
  address: string | null;
  postcode: string | null;
  birth_date: Date | null;
  gender: 'M' | 'F' | null;
  profile_image: string | null;
  newsletter_subscribe: boolean;
  marketing_agree: boolean;
  privacy_agree_date: Date | null;
  terms_agree_date: Date | null;
  created_at: Date;
  updated_at: Date;
}

export class MySQLUserProfileRepository implements IUserProfileRepository {
  async findById(id: number): Promise<UserProfile | null> {
    const row = await queryOne<UserProfileRow>(
      'SELECT * FROM user_profiles WHERE id = ?',
      [id]
    );

    return row ? this.mapToUserProfile(row) : null;
  }

  async findByUserId(userId: number): Promise<UserProfile | null> {
    const row = await queryOne<UserProfileRow>(
      'SELECT * FROM user_profiles WHERE user_id = ?',
      [userId]
    );

    return row ? this.mapToUserProfile(row) : null;
  }

  async save(profile: UserProfile): Promise<UserProfile> {
    const result = await query<any>(
      `INSERT INTO user_profiles (
        user_id, church_name, position, denomination, address, postcode,
        birth_date, gender, profile_image, newsletter_subscribe, marketing_agree,
        privacy_agree_date, terms_agree_date, created_at, updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        profile.userId,
        profile.churchName,
        profile.position,
        profile.denomination,
        profile.address,
        profile.postcode,
        profile.birthDate,
        profile.gender,
        profile.profileImage,
        profile.newsletterSubscribe,
        profile.marketingAgree,
        profile.privacyAgreeDate,
        profile.termsAgreeDate
      ]
    );

    return new UserProfile(
      (result as any).insertId,
      profile.userId,
      profile.churchName,
      profile.position,
      profile.denomination,
      profile.address,
      profile.postcode,
      profile.birthDate,
      profile.gender,
      profile.profileImage,
      profile.newsletterSubscribe,
      profile.marketingAgree,
      profile.privacyAgreeDate,
      profile.termsAgreeDate,
      new Date(),
      new Date()
    );
  }

  async update(profile: UserProfile): Promise<void> {
    await query(
      `UPDATE user_profiles
       SET church_name = ?, position = ?, denomination = ?, address = ?, postcode = ?,
           birth_date = ?, gender = ?, profile_image = ?, newsletter_subscribe = ?,
           marketing_agree = ?, privacy_agree_date = ?, terms_agree_date = ?,
           updated_at = NOW()
       WHERE id = ?`,
      [
        profile.churchName,
        profile.position,
        profile.denomination,
        profile.address,
        profile.postcode,
        profile.birthDate,
        profile.gender,
        profile.profileImage,
        profile.newsletterSubscribe,
        profile.marketingAgree,
        profile.privacyAgreeDate,
        profile.termsAgreeDate,
        profile.id
      ]
    );
  }

  async delete(id: number): Promise<void> {
    await query('DELETE FROM user_profiles WHERE id = ?', [id]);
  }

  private mapToUserProfile(row: UserProfileRow): UserProfile {
    return new UserProfile(
      row.id,
      row.user_id,
      row.church_name,
      row.position,
      row.denomination,
      row.address,
      row.postcode,
      row.birth_date,
      row.gender,
      row.profile_image,
      !!row.newsletter_subscribe,
      !!row.marketing_agree,
      row.privacy_agree_date,
      row.terms_agree_date,
      row.created_at,
      row.updated_at
    );
  }
}