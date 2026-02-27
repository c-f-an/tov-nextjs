import { describe, it, expect } from 'vitest';
import { User, UserType, UserRole, UserStatus, LoginType } from './User';

describe('User.create()', () => {
  const baseParams = {
    email: 'test@example.com',
    password: 'hashed-password',
    name: '홍길동',
    loginType: LoginType.email,
    username: null,
    avatarUrl: null,
    phone: null,
  };

  it('userType 미지정 시 NORMAL로 생성된다', () => {
    const user = User.create(baseParams);
    expect(user.userType).toBe(UserType.NORMAL);
  });

  it('userType MEMBER로 생성된다', () => {
    const user = User.create({ ...baseParams, userType: UserType.MEMBER });
    expect(user.userType).toBe(UserType.MEMBER);
  });

  it('userType SPONSOR로 생성된다', () => {
    const user = User.create({ ...baseParams, userType: UserType.SPONSOR });
    expect(user.userType).toBe(UserType.SPONSOR);
  });

  it('기본 role은 USER이다', () => {
    const user = User.create(baseParams);
    expect(user.role).toBe(UserRole.USER);
  });

  it('기본 status는 active이다', () => {
    const user = User.create(baseParams);
    expect(user.status).toBe(UserStatus.active);
  });

  it('id는 0으로 생성된다 (DB auto-increment 대기)', () => {
    const user = User.create(baseParams);
    expect(user.id).toBe(0);
  });
});

describe('User 헬퍼 메서드', () => {
  const makeUser = (_overrides: Record<string, unknown> = {}) =>
    new User(
      1,
      'test@example.com',
      '홍길동',
      UserRole.USER,
      UserStatus.active,
      LoginType.email,
      UserType.NORMAL,
    );

  it('isEmailVerified: emailVerifiedAt이 null이면 false', () => {
    const user = new User(1, 'a@b.com', '이름', UserRole.USER, UserStatus.active, LoginType.email, UserType.NORMAL, null, null, null, null);
    expect(user.isEmailVerified()).toBe(false);
  });

  it('isEmailVerified: emailVerifiedAt이 있으면 true', () => {
    const user = new User(1, 'a@b.com', '이름', UserRole.USER, UserStatus.active, LoginType.email, UserType.NORMAL, null, null, null, new Date());
    expect(user.isEmailVerified()).toBe(true);
  });

  it('isSocialLogin: email 로그인이면 false', () => {
    const user = new User(1, 'a@b.com', '이름', UserRole.USER, UserStatus.active, LoginType.email, UserType.NORMAL);
    expect(user.isSocialLogin()).toBe(false);
  });

  it('isSocialLogin: google 로그인이면 true', () => {
    const user = new User(1, 'a@b.com', '이름', UserRole.USER, UserStatus.active, LoginType.google, UserType.NORMAL);
    expect(user.isSocialLogin()).toBe(true);
  });

  it('isActive: active 상태면 true', () => {
    const user = new User(1, 'a@b.com', '이름', UserRole.USER, UserStatus.active, LoginType.email, UserType.NORMAL);
    expect(user.isActive()).toBe(true);
  });

  it('isActive: inactive 상태면 false', () => {
    const user = new User(1, 'a@b.com', '이름', UserRole.USER, UserStatus.inactive, LoginType.email, UserType.NORMAL);
    expect(user.isActive()).toBe(false);
  });
});
