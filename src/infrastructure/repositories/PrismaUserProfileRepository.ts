import { UserProfile } from '@/core/domain/entities/UserProfile';
import { IUserProfileRepository } from '@/core/domain/repositories/IUserProfileRepository';
import { prisma } from '../database/prisma';
import { UserProfile as PrismaUserProfile, Gender } from '@prisma/client';

export class PrismaUserProfileRepository implements IUserProfileRepository {
  private toDomain(prismaProfile: PrismaUserProfile): UserProfile {
    return new UserProfile(
      prismaProfile.id,
      prismaProfile.user_id,
      prismaProfile.church_name,
      prismaProfile.position,
      prismaProfile.denomination,
      prismaProfile.address,
      prismaProfile.postcode,
      prismaProfile.birth_date,
      prismaProfile.gender as 'M' | 'F' | null,
      prismaProfile.profile_image,
      prismaProfile.newsletter_subscribe,
      prismaProfile.marketing_agree,
      prismaProfile.privacy_agree_date,
      prismaProfile.terms_agree_date,
      prismaProfile.created_at || new Date(),
      prismaProfile.updated_at || new Date()
    );
  }

  async findById(id: number): Promise<UserProfile | null> {
    const profile = await prisma.userProfile.findUnique({
      where: { id }
    });

    return profile ? this.toDomain(profile) : null;
  }

  async findByUserId(userId: number): Promise<UserProfile | null> {
    const profile = await prisma.userProfile.findFirst({
      where: { user_id: userId }
    });

    return profile ? this.toDomain(profile) : null;
  }

  async save(profile: UserProfile): Promise<UserProfile> {
    const savedProfile = await prisma.userProfile.create({
      data: {
        user_id: profile.userId,
        church_name: profile.churchName,
        position: profile.position,
        denomination: profile.denomination,
        address: profile.address,
        postcode: profile.postcode,
        birth_date: profile.birthDate,
        gender: profile.gender as Gender | undefined,
        profile_image: profile.profileImage,
        newsletter_subscribe: profile.newsletterSubscribe,
        marketing_agree: profile.marketingAgree,
        privacy_agree_date: profile.privacyAgreeDate,
        terms_agree_date: profile.termsAgreeDate
      }
    });

    return this.toDomain(savedProfile);
  }

  async update(profile: UserProfile): Promise<void> {
    await prisma.userProfile.update({
      where: { id: profile.id },
      data: {
        church_name: profile.churchName,
        position: profile.position,
        denomination: profile.denomination,
        address: profile.address,
        postcode: profile.postcode,
        birth_date: profile.birthDate,
        gender: profile.gender as Gender | undefined,
        profile_image: profile.profileImage,
        newsletter_subscribe: profile.newsletterSubscribe,
        marketing_agree: profile.marketingAgree,
        privacy_agree_date: profile.privacyAgreeDate,
        terms_agree_date: profile.termsAgreeDate
      }
    });
  }

  async delete(id: number): Promise<void> {
    await prisma.userProfile.delete({
      where: { id }
    });
  }
}