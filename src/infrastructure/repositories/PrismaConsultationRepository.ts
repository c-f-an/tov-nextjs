import { injectable } from 'tsyringe';
import { PrismaClient } from '@prisma/client';
import { Consultation, ConsultationStatus } from '@/core/domain/entities/Consultation';
import { IConsultationRepository } from '@/core/domain/repositories/IConsultationRepository';
import { prisma } from '../database/prisma';

interface FindPaginatedOptions {
  userId?: number;
  status?: ConsultationStatus;
  offset: number;
  limit: number;
}

@injectable()
export class PrismaConsultationRepository implements IConsultationRepository {
  private prisma: PrismaClient = prisma;

  async save(consultation: Consultation): Promise<Consultation> {
    const data = {
      userId: consultation.userId,
      name: consultation.name,
      phone: consultation.phone,
      email: consultation.email,
      churchName: consultation.churchName,
      position: consultation.position,
      consultationType: consultation.consultationType,
      preferredDate: consultation.preferredDate,
      preferredTime: consultation.preferredTime,
      title: consultation.title,
      content: consultation.content,
      status: consultation.status as string,
      assignedTo: consultation.assignedTo,
      consultationDate: consultation.consultationDate,
      consultationNotes: consultation.consultationNotes,
      privacyAgree: consultation.privacyAgree
    };

    const saved = consultation.id
      ? await this.prisma.consultation.update({
          where: { id: consultation.id },
          data
        })
      : await this.prisma.consultation.create({ data });

    return this.mapToEntity(saved);
  }

  async findById(id: number): Promise<Consultation | null> {
    const consultation = await this.prisma.consultation.findUnique({
      where: { id }
    });

    return consultation ? this.mapToEntity(consultation) : null;
  }

  async findPaginated(options: FindPaginatedOptions): Promise<{ consultations: Consultation[]; total: number }> {
    const where: any = {};

    if (options.userId) {
      where.userId = options.userId;
    }

    if (options.status) {
      where.status = options.status;
    }

    const [consultations, total] = await Promise.all([
      this.prisma.consultation.findMany({
        where,
        skip: options.offset,
        take: options.limit,
        orderBy: { createdAt: 'desc' }
      }),
      this.prisma.consultation.count({ where })
    ]);

    return {
      consultations: consultations.map(this.mapToEntity),
      total
    };
  }

  async findByUserId(userId: number): Promise<Consultation[]> {
    const consultations = await this.prisma.consultation.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    return consultations.map(this.mapToEntity);
  }

  async updateStatus(id: number, status: ConsultationStatus): Promise<void> {
    await this.prisma.consultation.update({
      where: { id },
      data: { status: status as string }
    });
  }

  async delete(id: number): Promise<void> {
    await this.prisma.consultation.delete({
      where: { id }
    });
  }

  private mapToEntity(prismaConsultation: any): Consultation {
    return new Consultation(
      prismaConsultation.id,
      prismaConsultation.userId,
      prismaConsultation.name,
      prismaConsultation.phone,
      prismaConsultation.email,
      prismaConsultation.churchName,
      prismaConsultation.position,
      prismaConsultation.consultationType,
      prismaConsultation.preferredDate,
      prismaConsultation.preferredTime,
      prismaConsultation.title,
      prismaConsultation.content,
      prismaConsultation.status as ConsultationStatus,
      prismaConsultation.assignedTo,
      prismaConsultation.consultationDate,
      prismaConsultation.consultationNotes,
      prismaConsultation.privacyAgree,
      prismaConsultation.createdAt,
      prismaConsultation.updatedAt
    );
  }
}