import { User, UserRole, UserStatus, LoginType, UserType } from '@/core/domain/entities/User';

export class UserDto {
  id: number;
  email: string;
  name: string;
  role: UserRole;
  status: UserStatus;
  loginType: LoginType;
  userType: UserType;
  username?: string | null;
  phone?: string | null;
  avatarUrl?: string | null;
  createdAt?: Date | null;
  updatedAt?: Date | null;

  constructor(data: UserDto) {
    this.id = data.id;
    this.email = data.email;
    this.name = data.name;
    this.role = data.role;
    this.status = data.status;
    this.loginType = data.loginType;
    this.userType = data.userType;
    this.username = data.username;
    this.phone = data.phone;
    this.avatarUrl = data.avatarUrl;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  static fromEntity(user: User): UserDto {
    return new UserDto({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      status: user.status,
      loginType: user.loginType,
      userType: user.userType,
      username: user.username,
      phone: user.phone,
      avatarUrl: user.avatarUrl,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  }
}
