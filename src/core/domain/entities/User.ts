export enum UserStatus {
  active = 'active',
  inactive = 'inactive',
  suspended = 'suspended'
}

export enum LoginType {
  email = 'email',
  google = 'google',
  naver = 'naver',
  kakao = 'kakao',
  apple = 'apple'
}

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN'
}

export enum UserType {
  NORMAL = 0,      // 일반
  SPONSOR = 1,     // 후원
  MEMBER = 2,      // 정회원
  PENDING = 3      // 정회원승인대기
}

export interface IUser {
  id: number;
  username?: string | null;
  email: string;
  password?: string | null;
  name: string;
  phone?: string | null;
  role: UserRole;
  status: UserStatus;
  userType: UserType;
  emailVerifiedAt?: Date | null;
  rememberToken?: string | null;
  loginType: LoginType;
  avatarUrl?: string | null;
  lastLoginAt?: Date | null;
  lastLoginIp?: string | null;
  createdAt?: Date | null;
  updatedAt?: Date | null;
}

export class User implements IUser {
  constructor(
    public readonly id: number,
    public readonly email: string,
    public readonly name: string,
    public readonly role: UserRole,
    public readonly status: UserStatus,
    public readonly loginType: LoginType,
    public readonly userType: UserType = UserType.NORMAL,
    public readonly username?: string | null,
    public readonly password?: string | null,
    public readonly phone?: string | null,
    public readonly emailVerifiedAt?: Date | null,
    public readonly rememberToken?: string | null,
    public readonly avatarUrl?: string | null,
    public readonly lastLoginAt?: Date | null,
    public readonly lastLoginIp?: string | null,
    public readonly createdAt?: Date | null,
    public readonly updatedAt?: Date | null
  ) {}

  static create(params: Omit<IUser, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'emailVerifiedAt' | 'lastLoginAt' | 'lastLoginIp' | 'rememberToken' | 'role' | 'userType'>): User {
    return new User(
      0, // Auto-increment ID will be assigned by database
      params.email,
      params.name,
      UserRole.USER, // Default role
      UserStatus.active,
      params.loginType || LoginType.email,
      UserType.NORMAL, // Default user type
      params.username,
      params.password,
      params.phone,
      null,
      null,
      params.avatarUrl,
      null,
      null,
      new Date(),
      new Date()
    );
  }

  isEmailVerified(): boolean {
    return this.emailVerifiedAt !== null;
  }

  isSocialLogin(): boolean {
    return this.loginType !== LoginType.email;
  }

  isActive(): boolean {
    return this.status === UserStatus.active;
  }
}