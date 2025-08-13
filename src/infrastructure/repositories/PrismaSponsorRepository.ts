import { injectable } from 'tsyringe';
import { PrismaClient } from '@prisma/client';
import { Sponsor, SponsorType, SponsorStatus } from '@/core/domain/entities/Sponsor';
import { ISponsorRepository } from '@/core/domain/repositories/ISponsorRepository';
import { prisma } from '../database/prisma';

@injectable()
export class PrismaSponsorRepository implements ISponsorRepository {
  private prisma: PrismaClient = prisma;

  async save(sponsor: Sponsor): Promise<Sponsor> {
    const data = {
      userId: sponsor.userId,
      sponsorType: sponsor.sponsorType as string,
      name: sponsor.name,
      organizationName: sponsor.organizationName,
      phone: sponsor.phone,
      email: sponsor.email,
      address: sponsor.address,
      postcode: sponsor.postcode,
      sponsorStatus: sponsor.sponsorStatus as string,
      privacyAgree: sponsor.privacyAgree,
      receiptRequired: sponsor.receiptRequired
    };

    const saved = sponsor.id
      ? await this.prisma.sponsor.update({
          where: { id: sponsor.id },
          data
        })
      : await this.prisma.sponsor.create({ data });

    return this.mapToEntity(saved);
  }

  async findById(id: number): Promise<Sponsor | null> {
    const sponsor = await this.prisma.sponsor.findUnique({
      where: { id }
    });

    return sponsor ? this.mapToEntity(sponsor) : null;
  }

  async findByUserId(userId: number): Promise<Sponsor[]> {
    const sponsors = await this.prisma.sponsor.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    return sponsors.map(this.mapToEntity);
  }

  async findAll(): Promise<Sponsor[]> {
    const sponsors = await this.prisma.sponsor.findMany({
      orderBy: { createdAt: 'desc' }
    });

    return sponsors.map(this.mapToEntity);
  }

  async delete(id: number): Promise<void> {
    await this.prisma.sponsor.delete({
      where: { id }
    });
  }

  private mapToEntity(prismaSponsor: any): Sponsor {
    return new Sponsor(
      prismaSponsor.id,
      prismaSponsor.userId,
      prismaSponsor.sponsorType as SponsorType,
      prismaSponsor.name,
      prismaSponsor.organizationName,
      prismaSponsor.phone,
      prismaSponsor.email,
      prismaSponsor.address,
      prismaSponsor.postcode,
      prismaSponsor.sponsorStatus as SponsorStatus,
      prismaSponsor.privacyAgree,
      prismaSponsor.receiptRequired,
      prismaSponsor.createdAt,
      prismaSponsor.updatedAt
    );
  }
}