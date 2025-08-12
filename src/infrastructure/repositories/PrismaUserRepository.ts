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
      prismaUser.loginType as LoginType,
      prismaUser.username,
      prismaUser.password,
      prismaUser.phone,
      prismaUser.emailVerifiedAt,
      prismaUser.rememberToken,
      prismaUser.avatarUrl,
      prismaUser.lastLoginAt,
      prismaUser.lastLoginIp,
      prismaUser.createdAt,
      prismaUser.updatedAt
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
        loginType: user.loginType,
        avatarUrl: user.avatarUrl,
        emailVerifiedAt: user.emailVerifiedAt,
        rememberToken: user.rememberToken,
        lastLoginAt: user.lastLoginAt,
        lastLoginIp: user.lastLoginIp,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
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
        loginType: user.loginType,
        avatarUrl: user.avatarUrl,
        emailVerifiedAt: user.emailVerifiedAt,
        rememberToken: user.rememberToken,
        lastLoginAt: user.lastLoginAt,
        lastLoginIp: user.lastLoginIp,
        updatedAt: user.updatedAt
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