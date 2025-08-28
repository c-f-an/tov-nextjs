import { UserProfile } from '../entities/UserProfile';

interface IUserProfileRepository {
  findById(id: number): Promise<UserProfile | null>;
  findByUserId(userId: number): Promise<UserProfile | null>;
  save(profile: UserProfile): Promise<UserProfile>;
  update(profile: UserProfile): Promise<void>;
  delete(id: number): Promise<void>;
}

export type { IUserProfileRepository };