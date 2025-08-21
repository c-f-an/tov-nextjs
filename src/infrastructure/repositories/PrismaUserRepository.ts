import { User, UserStatus, LoginType } from '@/core/domain/entities/User';
import { IUserRepository } from '@/core/domain/repositories/IUserRepository';
import { prisma } from '../database/prisma';
import { User as PrismaUser } from '@prisma/client';

export class PrismaUserRepository implements IUserRepository {
  private toDomain(prismaUser: PrismaUser): User {
    return new User(
      prismaUser.id,
      prismaUser.email,
      prismaUser.name,
      prismaUser.status as UserStatus,
      prismaUser.login_type as LoginType,
      prismaUser.username,
      prismaUser.password,
      prismaUser.phone,
      prismaUser.email_verified_at,
      prismaUser.remember_token,
      prismaUser.avatar_url,
      prismaUser.last_login_at,
      prismaUser.last_login_ip,
      prismaUser.created_at,
      prismaUser.updated_at
    );
  }

  async findById(id: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { id }
    });

    return user ? this.toDomain(user) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { email }
    });

    return user ? this.toDomain(user) : null;
  }

  async save(user: User): Promise<void> {
    await prisma.user.create({
      data: {
        email: user.email,
        username: user.username,
        password: user.password,
        name: user.name,
        phone: user.phone,
        status: user.status,
        login_type: user.loginType,
        avatar_url: user.avatarUrl,
        email_verified_at: user.emailVerifiedAt,
        remember_token: user.rememberToken,
        last_login_at: user.lastLoginAt,
        last_login_ip: user.lastLoginIp,
        created_at: user.createdAt,
        updated_at: user.updatedAt
      }
    });
  }

  async update(user: User): Promise<void> {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        email: user.email,
        username: user.username,
        password: user.password,
        name: user.name,
        phone: user.phone,
        status: user.status,
        login_type: user.loginType,
        avatar_url: user.avatarUrl,
        email_verified_at: user.emailVerifiedAt,
        remember_token: user.rememberToken,
        last_login_at: user.lastLoginAt,
        last_login_ip: user.lastLoginIp,
        updated_at: user.updatedAt
      }
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.user.delete({
      where: { id }
    });
  }

  async findAll(): Promise<User[]> {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' }
    });

    return users.map(user => this.toDomain(user));
  }
}