import type { IUserRepository } from '@/core/domain/repositories/IUserRepository';
import type { IAuthService } from '@/core/domain/services/IAuthService';
import { LoginDto, AuthResponseDto } from '../../dto/AuthDto';
import { Password } from '@/core/domain/value-objects/Password';
import { UserStatus, User } from '@/core/domain/entities/User';

export class LoginUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly authService: IAuthService
  ) {}

  async execute(dto: LoginDto, ipAddress?: string, userAgent?: string): Promise<AuthResponseDto> {
    const user = await this.userRepository.findByEmail(dto.email);
    
    if (!user || !user.password) {
      throw new Error('Invalid email or password');
    }

    if (user.status !== UserStatus.active) {
      throw new Error('Account is not active');
    }

    const password = Password.fromHash(user.password);
    const isPasswordValid = await password.compare(dto.password);

    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    const tokens = await this.authService.generateTokenPair({
      userId: user.id,
      email: user.email,
      loginType: user.loginType,
      role: user.role
    }, userAgent, ipAddress);

    // Update last login time
    const updatedUser = new User(
      user.id,
      user.email,
      user.name,
      user.role,
      user.status,
      user.loginType,
      user.userType,
      user.username,
      user.password,
      user.phone,
      user.emailVerifiedAt,
      user.rememberToken,
      user.avatarUrl,
      new Date(),
      ipAddress,
      user.createdAt,
      new Date()
    );
    await this.userRepository.update(updatedUser);

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