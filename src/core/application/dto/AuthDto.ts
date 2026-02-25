export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  name: string;
  phoneNumber?: string;
  churchName?: string;
  position?: string;
  userType?: number;
}

export interface RefreshTokenDto {
  refreshToken: string;
}

export interface SocialLoginDto {
  provider: 'google' | 'naver' | 'kakao' | 'apple';
  accessToken: string;
  email?: string;
  name?: string;
}

export interface VerifyEmailDto {
  email: string;
  code: string;
}

export interface ResetPasswordDto {
  email: string;
  code: string;
  newPassword: string;
}

export interface AuthResponseDto {
  user: {
    id: number;
    email: string;
    name: string;
    role: string;
    loginType: string;
    isEmailVerified: boolean;
    userType?: number;
  };
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}