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
      user_id: consultation.userId,
      name: consultation.name,
      phone: consultation.phone,
      email: consultation.email,
      church_name: consultation.churchName,
      position: consultation.position,
      consultation_type: consultation.consultationType,
      preferred_date: consultation.preferredDate,
      preferred_time: consultation.preferredTime,
      title: consultation.title,
      content: consultation.content,
      status: consultation.status as string,
      assigned_to: consultation.assignedTo,
      consultation_date: consultation.consultationDate,
      consultation_notes: consultation.consultationNotes,
      privacy_agree: consultation.privacyAgree
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
      where.user_id = options.userId;
    }

    if (options.status) {
      where.status = options.status;
    }

    const [consultations, total] = await Promise.all([
      this.prisma.consultation.findMany({
        where,
        skip: options.offset,
        take: options.limit,
        orderBy: { created_at: 'desc' }
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
      where: { user_id: userId },
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

  async findAll(): Promise<Consultation[]> {
    const consultations = await this.prisma.consultation.findMany({
      orderBy: { created_at: 'desc' }
    });

    return consultations.map(this.mapToEntity);
  }

  private mapToEntity(prismaConsultation: any): Consultation {
    return new Consultation(
      prismaConsultation.id,
      prismaConsultation.user_id,
      prismaConsultation.name,
      prismaConsultation.phone,
      prismaConsultation.email,
      prismaConsultation.church_name,
      prismaConsultation.position,
      prismaConsultation.consultation_type,
      prismaConsultation.preferred_date,
      prismaConsultation.preferred_time,
      prismaConsultation.title,
      prismaConsultation.content,
      prismaConsultation.status as ConsultationStatus,
      prismaConsultation.assigned_to,
      prismaConsultation.consultation_date,
      prismaConsultation.consultation_notes,
      prismaConsultation.privacy_agree,
      prismaConsultation.created_at,
      prismaConsultation.updated_at
    );
  }
}