import { RefreshToken } from '../entities/RefreshToken';

interface IRefreshTokenRepository {
  findByTokenHash(tokenHash: string): Promise<RefreshToken | null>;
  findByUserId(userId: number): Promise<RefreshToken[]>;
  save(refreshToken: RefreshToken): Promise<void>;
  update(refreshToken: RefreshToken): Promise<void>;
  deleteByTokenHash(tokenHash: string): Promise<void>;
  deleteByUserId(userId: number): Promise<void>;
  deleteExpiredTokens(): Promise<void>;
}

export type { IRefreshTokenRepository };