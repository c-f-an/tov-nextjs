export interface TokenPayload {
  userId: number;
  email: string;
  loginType: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface IAuthService {
  generateTokenPair(payload: TokenPayload, deviceInfo?: string, ipAddress?: string): Promise<TokenPair>;
  verifyAccessToken(token: string): Promise<TokenPayload | null>;
  verifyRefreshToken(token: string): Promise<TokenPayload | null>;
  revokeRefreshToken(token: string, reason?: string): Promise<void>;
  isRefreshTokenRevoked(token: string): Promise<boolean>;
  hashToken(token: string): string;
}