import { describe, it, expect } from 'vitest';
import type { RegisterDto, AuthResponseDto } from './AuthDto';

describe('AuthDto types', () => {
  it('RegisterDto should accept userType field', () => {
    const dto: RegisterDto = {
      email: 'test@example.com',
      password: 'password123!',
      name: '홍길동',
      userType: 1,
    };
    expect(dto.userType).toBe(1);
  });

  it('RegisterDto userType should be optional', () => {
    const dto: RegisterDto = {
      email: 'test@example.com',
      password: 'password123!',
      name: '홍길동',
    };
    expect(dto.userType).toBeUndefined();
  });

  it('AuthResponseDto should include user and tokens', () => {
    const response: AuthResponseDto = {
      user: {
        id: 1,
        email: 'test@example.com',
        name: '홍길동',
        role: 'USER',
        loginType: 'email',
        isEmailVerified: false,
      },
      tokens: {
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      },
    };
    expect(response.user.id).toBe(1);
    expect(response.tokens.accessToken).toBe('access-token');
  });
});
