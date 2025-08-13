import 'server-only';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { IAuthService, TokenPayload, TokenPair } from '@/core/domain/services/IAuthService';
import { IRefreshTokenRepository } from '@/core/domain/repositories/IRefreshTokenRepository';
import { RefreshToken } from '@/core/domain/entities/RefreshToken';

export class JwtAuthService implements IAuthService {
  private readonly accessTokenSecret: string;
  private readonly refreshTokenSecret: string;
  private readonly accessTokenExpiresIn: string = '15m';
  private readonly refreshTokenExpiresIn: string = '7d';

  constructor(
    private readonly refreshTokenRepository: IRefreshTokenRepository,
    accessTokenSecret: string,
    refreshTokenSecret: string
  ) {
    this.accessTokenSecret = accessTokenSecret;
    this.refreshTokenSecret = refreshTokenSecret;
  }

  hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  async generateTokenPair(payload: TokenPayload, deviceInfo?: string, ipAddress?: string): Promise<TokenPair> {
    const jti = crypto.randomUUID();
    
    const accessToken = jwt.sign({ ...payload, jti }, this.accessTokenSecret, {
      expiresIn: this.accessTokenExpiresIn
    });

    const refreshToken = jwt.sign({ ...payload, jti }, this.refreshTokenSecret, {
      expiresIn: this.refreshTokenExpiresIn
    });

    // Hash the refresh token before storing
    const tokenHash = this.hashToken(refreshToken);

    // Save refresh token to database
    const refreshTokenEntity = RefreshToken.create(tokenHash, payload.userId, deviceInfo, ipAddress, 7);
    await this.refreshTokenRepository.save(refreshTokenEntity);

    return {
      accessToken,
      refreshToken
    };
  }

  async verifyAccessToken(token: string): Promise<TokenPayload | null> {
    try {
      const decoded = jwt.verify(token, this.accessTokenSecret) as TokenPayload;
      return decoded;
    } catch (error) {
      return null;
    }
  }

  async verifyRefreshToken(token: string): Promise<TokenPayload | null> {
    try {
      const decoded = jwt.verify(token, this.refreshTokenSecret) as TokenPayload;
      return decoded;
    } catch (error) {
      return null;
    }
  }

  async revokeRefreshToken(token: string, reason?: string): Promise<void> {
    const tokenHash = this.hashToken(token);
    const refreshToken = await this.refreshTokenRepository.findByTokenHash(tokenHash);
    if (refreshToken && !refreshToken.isRevoked()) {
      const revokedToken = refreshToken.revoke(reason);
      await this.refreshTokenRepository.update(revokedToken);
    }
  }

  async isRefreshTokenRevoked(token: string): Promise<boolean> {
    const tokenHash = this.hashToken(token);
    const refreshToken = await this.refreshTokenRepository.findByTokenHash(tokenHash);
    return refreshToken ? refreshToken.isRevoked() : true;
  }
}