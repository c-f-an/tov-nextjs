import { injectable } from 'tsyringe';
import { PrismaClient } from '@prisma/client';
import { Donation, DonationType } from '@/core/domain/entities/DonationNew';
import { IDonationRepository } from '@/core/domain/repositories/IDonationRepository';
import { prisma } from '../database/prisma';

interface FindPaginatedOptions {
  sponsorId?: number;
  offset: number;
  limit: number;
  startDate?: Date;
  endDate?: Date;
}

@injectable()
export class PrismaDonationRepository implements IDonationRepository {
  private prisma: PrismaClient = prisma;

  async save(donation: Donation): Promise<Donation> {
    const data = {
      sponsorId: donation.sponsorId,
      donationType: donation.donationType as string,
      amount: donation.amount,
      paymentMethod: donation.paymentMethod,
      paymentDate: donation.paymentDate,
      receiptNumber: donation.receiptNumber,
      purpose: donation.purpose,
      memo: donation.memo
    };

    const saved = donation.id
      ? await this.prisma.donation.update({
          where: { id: donation.id },
          data
        })
      : await this.prisma.donation.create({ data });

    return this.mapToEntity(saved);
  }

  async findById(id: number): Promise<Donation | null> {
    const donation = await this.prisma.donation.findUnique({
      where: { id }
    });

    return donation ? this.mapToEntity(donation) : null;
  }

  async findBySponsorId(sponsorId: number): Promise<Donation[]> {
    const donations = await this.prisma.donation.findMany({
      where: { sponsorId },
      orderBy: { paymentDate: 'desc' }
    });

    return donations.map(this.mapToEntity);
  }

  async findPaginated(options: FindPaginatedOptions): Promise<{ donations: Donation[]; total: number; totalAmount: number }> {
    const where: any = {};

    if (options.sponsorId) {
      where.sponsorId = options.sponsorId;
    }

    if (options.startDate || options.endDate) {
      where.paymentDate = {};
      if (options.startDate) {
        where.paymentDate.gte = options.startDate;
      }
      if (options.endDate) {
        where.paymentDate.lte = options.endDate;
      }
    }

    const [donations, total, aggregateResult] = await Promise.all([
      this.prisma.donation.findMany({
        where,
        skip: options.offset,
        take: options.limit,
        orderBy: { paymentDate: 'desc' }
      }),
      this.prisma.donation.count({ where }),
      this.prisma.donation.aggregate({
        where,
        _sum: { amount: true }
      })
    ]);

    return {
      donations: donations.map(this.mapToEntity),
      total,
      totalAmount: Number(aggregateResult._sum.amount || 0)
    };
  }

  async delete(id: number): Promise<void> {
    await this.prisma.donation.delete({
      where: { id }
    });
  }

  private mapToEntity(prismaDonation: any): Donation {
    return new Donation(
      prismaDonation.id,
      prismaDonation.sponsorId,
      prismaDonation.donationType as DonationType,
      Number(prismaDonation.amount),
      prismaDonation.paymentMethod,
      prismaDonation.paymentDate,
      prismaDonation.receiptNumber,
      prismaDonation.purpose,
      prismaDonation.memo,
      prismaDonation.createdAt,
      prismaDonation.updatedAt
    );
  }
}