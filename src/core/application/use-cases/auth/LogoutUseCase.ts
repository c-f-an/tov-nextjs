import { IAuthService } from '@/core/domain/services/IAuthService';

export class LogoutUseCase {
  constructor(
    private readonly authService: IAuthService
  ) {}

  async execute(refreshToken: string, reason?: string): Promise<void> {
    // Revoke refresh token
    await this.authService.revokeRefreshToken(refreshToken, reason);
  }
}