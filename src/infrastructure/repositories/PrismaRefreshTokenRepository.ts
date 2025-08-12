import { RefreshToken } from '@/core/domain/entities/RefreshToken';
import { IRefreshTokenRepository } from '@/core/domain/repositories/IRefreshTokenRepository';
import { prisma } from '../database/prisma';
import { RefreshToken as PrismaRefreshToken } from '@prisma/client';

export class PrismaRefreshTokenRepository implements IRefreshTokenRepository {
  private toDomain(prismaToken: PrismaRefreshToken): RefreshToken {
    return new RefreshToken(
      prismaToken.id,
      prismaToken.userId,
      prismaToken.tokenHash,
      prismaToken.expiresAt,
      prismaToken.deviceInfo,
      prismaToken.ipAddress,
      prismaToken.revokedAt,
      prismaToken.revokedReason,
      prismaToken.createdAt,
      prismaToken.updatedAt
    );
  }

  async findByTokenHash(tokenHash: string): Promise<RefreshToken | null> {
    const refreshToken = await prisma.refreshToken.findUnique({
      where: { tokenHash }
    });

    return refreshToken ? this.toDomain(refreshToken) : null;
  }

  async findByUserId(userId: number): Promise<RefreshToken[]> {
    const tokens = await prisma.refreshToken.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    return tokens.map(token => this.toDomain(token));
  }

  async save(refreshToken: RefreshToken): Promise<void> {
    await prisma.refreshToken.create({
      data: {
        userId: refreshToken.userId,
        tokenHash: refreshToken.tokenHash,
        deviceInfo: refreshToken.deviceInfo,
        ipAddress: refreshToken.ipAddress,
        expiresAt: refreshToken.expiresAt,
        revokedAt: refreshToken.revokedAt,
        revokedReason: refreshToken.revokedReason,
        createdAt: refreshToken.createdAt,
        updatedAt: refreshToken.updatedAt
      }
    });
  }

  async update(refreshToken: RefreshToken): Promise<void> {
    await prisma.refreshToken.update({
      where: { id: refreshToken.id },
      data: {
        revokedAt: refreshToken.revokedAt,
        revokedReason: refreshToken.revokedReason,
        updatedAt: refreshToken.updatedAt
      }
    });
  }

  async deleteByTokenHash(tokenHash: string): Promise<void> {
    await prisma.refreshToken.delete({
      where: { tokenHash }
    });
  }

  async deleteByUserId(userId: number): Promise<void> {
    await prisma.refreshToken.deleteMany({
      where: { userId }
    });
  }

  async deleteExpiredTokens(): Promise<void> {
    await prisma.refreshToken.deleteMany({
      where: {
        expiresAt: {
          lt: new Date()
        }
      }
    });
  }
}