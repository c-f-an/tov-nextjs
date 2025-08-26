import { RefreshToken } from '@/core/domain/entities/RefreshToken';
import { IRefreshTokenRepository } from '@/core/domain/repositories/IRefreshTokenRepository';
import { prisma } from '../database/prisma';
import { RefreshToken as PrismaRefreshToken } from '@prisma/client';

export class PrismaRefreshTokenRepository implements IRefreshTokenRepository {
  private toDomain(prismaToken: PrismaRefreshToken): RefreshToken {
    return new RefreshToken(
      prismaToken.id,
      prismaToken.user_id,
      prismaToken.token_hash,
      prismaToken.expires_at,
      prismaToken.device_info,
      prismaToken.ip_address,
      prismaToken.revoked_at,
      prismaToken.revoked_reason,
      prismaToken.created_at,
      prismaToken.updated_at
    );
  }

  async findByTokenHash(tokenHash: string): Promise<RefreshToken | null> {
    const refreshToken = await prisma.refreshToken.findUnique({
      where: { token_hash: tokenHash }
    });

    return refreshToken ? this.toDomain(refreshToken) : null;
  }

  async findByUserId(userId: number): Promise<RefreshToken[]> {
    const tokens = await prisma.refreshToken.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' }
    });

    return tokens.map(token => this.toDomain(token));
  }

  async save(refreshToken: RefreshToken): Promise<void> {
    await prisma.refreshToken.create({
      data: {
        user_id: refreshToken.userId,
        token_hash: refreshToken.tokenHash,
        device_info: refreshToken.deviceInfo,
        ip_address: refreshToken.ipAddress,
        expires_at: refreshToken.expiresAt,
        revoked_at: refreshToken.revokedAt,
        revoked_reason: refreshToken.revokedReason,
        created_at: refreshToken.createdAt,
        updated_at: refreshToken.updatedAt
      }
    });
  }

  async update(refreshToken: RefreshToken): Promise<void> {
    await prisma.refreshToken.update({
      where: { id: refreshToken.id },
      data: {
        revoked_at: refreshToken.revokedAt,
        revoked_reason: refreshToken.revokedReason,
        updated_at: refreshToken.updatedAt
      }
    });
  }

  async deleteByTokenHash(tokenHash: string): Promise<void> {
    await prisma.refreshToken.delete({
      where: { token_hash: tokenHash }
    });
  }

  async deleteByUserId(userId: number): Promise<void> {
    await prisma.refreshToken.deleteMany({
      where: { user_id: userId }
    });
  }

  async deleteExpiredTokens(): Promise<void> {
    await prisma.refreshToken.deleteMany({
      where: {
        expires_at: {
          lt: new Date()
        }
      }
    });
  }
}