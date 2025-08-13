import { UserProfile } from '@/core/domain/entities/UserProfile';
import { IUserProfileRepository } from '@/core/domain/repositories/IUserProfileRepository';
import { prisma } from '../database/prisma';
import { UserProfile as PrismaUserProfile, Gender } from '@prisma/client';

export class PrismaUserProfileRepository implements IUserProfileRepository {
  private toDomain(prismaProfile: PrismaUserProfile): UserProfile {
    return new UserProfile(
      prismaProfile.id,
      prismaProfile.userId,
      prismaProfile.churchName,
      prismaProfile.position,
      prismaProfile.denomination,
      prismaProfile.address,
      prismaProfile.postcode,
      prismaProfile.birthDate,
      prismaProfile.gender as 'M' | 'F' | null,
      prismaProfile.profileImage,
      prismaProfile.newsletterSubscribe,
      prismaProfile.marketingAgree,
      prismaProfile.privacyAgreeDate,
      prismaProfile.termsAgreeDate,
      prismaProfile.createdAt || new Date(),
      prismaProfile.updatedAt || new Date()
    );
  }

  async findById(id: number): Promise<UserProfile | null> {
    const profile = await prisma.userProfile.findUnique({
      where: { id }
    });

    return profile ? this.toDomain(profile) : null;
  }

  async findByUserId(userId: number): Promise<UserProfile | null> {
    const profile = await prisma.userProfile.findUnique({
      where: { userId }
    });

    return profile ? this.toDomain(profile) : null;
  }

  async save(profile: UserProfile): Promise<UserProfile> {
    const savedProfile = await prisma.userProfile.create({
      data: {
        userId: profile.userId,
        churchName: profile.churchName,
        position: profile.position,
        denomination: profile.denomination,
        address: profile.address,
        postcode: profile.postcode,
        birthDate: profile.birthDate,
        gender: profile.gender as Gender | undefined,
        profileImage: profile.profileImage,
        newsletterSubscribe: profile.newsletterSubscribe,
        marketingAgree: profile.marketingAgree,
        privacyAgreeDate: profile.privacyAgreeDate,
        termsAgreeDate: profile.termsAgreeDate
      }
    });

    return this.toDomain(savedProfile);
  }

  async update(profile: UserProfile): Promise<void> {
    await prisma.userProfile.update({
      where: { id: profile.id },
      data: {
        churchName: profile.churchName,
        position: profile.position,
        denomination: profile.denomination,
        address: profile.address,
        postcode: profile.postcode,
        birthDate: profile.birthDate,
        gender: profile.gender as Gender | undefined,
        profileImage: profile.profileImage,
        newsletterSubscribe: profile.newsletterSubscribe,
        marketingAgree: profile.marketingAgree,
        privacyAgreeDate: profile.privacyAgreeDate,
        termsAgreeDate: profile.termsAgreeDate
      }
    });
  }

  async delete(id: number): Promise<void> {
    await prisma.userProfile.delete({
      where: { id }
    });
  }
}