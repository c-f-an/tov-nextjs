import type { IUserRepository } from '@/core/domain/repositories/IUserRepository';
import type { IRefreshTokenRepository } from '@/core/domain/repositories/IRefreshTokenRepository';
import type { IAuthService } from '@/core/domain/services/IAuthService';
import { RefreshTokenDto, AuthResponseDto } from '../../dto/AuthDto';

export class RefreshTokenUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly refreshTokenRepository: IRefreshTokenRepository,
    private readonly authService: IAuthService
  ) {}

  async execute(dto: RefreshTokenDto): Promise<AuthResponseDto> {
    // Verify refresh token
    const payload = await this.authService.verifyRefreshToken(dto.refreshToken);
    if (!payload) {
      throw new Error('Invalid refresh token');
    }

    // Check if token is revoked
    const isRevoked = await this.authService.isRefreshTokenRevoked(dto.refreshToken);
    if (isRevoked) {
      throw new Error('Refresh token has been revoked');
    }

    // Find user
    const user = await this.userRepository.findById(payload.userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Revoke old refresh token
    await this.authService.revokeRefreshToken(dto.refreshToken);

    // Generate new token pair
    const tokens = await this.authService.generateTokenPair({
      userId: user.id,
      email: user.email,
      loginType: user.loginType,
      role: user.role
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        loginType: user.loginType,
        isEmailVerified: user.isEmailVerified(),
        userType: user.userType,
      },
      tokens
    };
  }
}