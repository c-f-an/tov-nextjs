import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RegisterUseCase } from './RegisterUseCase';
import { User, UserType, UserRole, UserStatus, LoginType } from '@/core/domain/entities/User';

const makeUser = (userType: UserType = UserType.NORMAL) =>
  new User(1, 'test@example.com', '홍길동', UserRole.USER, UserStatus.active, LoginType.email, userType);

const mockUserRepository = {
  findById: vi.fn(),
  findByEmail: vi.fn(),
  save: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
  findAll: vi.fn(),
};

const mockUserProfileRepository = {
  findByUserId: vi.fn(),
  save: vi.fn(),
  update: vi.fn(),
};

const mockAuthService = {
  generateTokenPair: vi.fn().mockResolvedValue({
    accessToken: 'access-token',
    refreshToken: 'refresh-token',
  }),
  verifyAccessToken: vi.fn(),
  verifyRefreshToken: vi.fn(),
  revokeRefreshToken: vi.fn(),
  isRefreshTokenRevoked: vi.fn(),
  hashToken: vi.fn(),
};

describe('RegisterUseCase', () => {
  let useCase: RegisterUseCase;

  beforeEach(() => {
    vi.clearAllMocks();
    mockUserRepository.findByEmail.mockResolvedValueOnce(null); // 첫 호출: 중복 체크
    useCase = new RegisterUseCase(
      mockUserRepository as any,
      mockUserProfileRepository as any,
      mockAuthService as any
    );
  });

  it('일반회원(NORMAL)으로 가입된다', async () => {
    mockUserRepository.findByEmail.mockResolvedValueOnce(makeUser(UserType.NORMAL)); // 두 번째 호출: 저장 후 조회
    mockUserRepository.save.mockResolvedValue(undefined);

    const result = await useCase.execute({
      email: 'test@example.com',
      password: 'Password123!',
      name: '홍길동',
      userType: UserType.NORMAL,
    });

    expect(result.user.userType).toBe(UserType.NORMAL);
  });

  it('정회원(MEMBER)으로 가입된다', async () => {
    mockUserRepository.findByEmail.mockResolvedValueOnce(makeUser(UserType.MEMBER));
    mockUserRepository.save.mockResolvedValue(undefined);

    const result = await useCase.execute({
      email: 'test@example.com',
      password: 'Password123!',
      name: '홍길동',
      userType: UserType.MEMBER,
    });

    expect(result.user.userType).toBe(UserType.MEMBER);
  });

  it('후원회원(SPONSOR)으로 가입된다', async () => {
    mockUserRepository.findByEmail.mockResolvedValueOnce(makeUser(UserType.SPONSOR));
    mockUserRepository.save.mockResolvedValue(undefined);

    const result = await useCase.execute({
      email: 'test@example.com',
      password: 'Password123!',
      name: '홍길동',
      userType: UserType.SPONSOR,
    });

    expect(result.user.userType).toBe(UserType.SPONSOR);
  });

  it('userType 미지정 시 NORMAL로 가입된다', async () => {
    mockUserRepository.findByEmail.mockResolvedValueOnce(makeUser(UserType.NORMAL));
    mockUserRepository.save.mockResolvedValue(undefined);

    const result = await useCase.execute({
      email: 'test@example.com',
      password: 'Password123!',
      name: '홍길동',
    });

    expect(result.user.userType).toBe(UserType.NORMAL);
  });

  it('이미 존재하는 이메일이면 에러를 던진다', async () => {
    // findByEmail이 첫 호출(중복 체크)에서 user를 반환하도록
    mockUserRepository.findByEmail
      .mockReset()
      .mockResolvedValueOnce(makeUser());

    await expect(
      useCase.execute({
        email: 'test@example.com',
        password: 'Password123!',
        name: '홍길동',
      })
    ).rejects.toThrow('User with this email already exists');
  });

  it('응답에 accessToken과 refreshToken이 포함된다', async () => {
    mockUserRepository.findByEmail.mockResolvedValueOnce(makeUser());
    mockUserRepository.save.mockResolvedValue(undefined);

    const result = await useCase.execute({
      email: 'test@example.com',
      password: 'Password123!',
      name: '홍길동',
    });

    expect(result.tokens.accessToken).toBe('access-token');
    expect(result.tokens.refreshToken).toBe('refresh-token');
  });
});
