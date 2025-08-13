import { FAQ } from '@/core/domain/entities/FAQ';
import { IFAQRepository } from '@/core/domain/repositories/IFAQRepository';
import { prisma } from '../database/prisma';
import { Faq as PrismaFAQ } from '@prisma/client';

export class PrismaFAQRepository implements IFAQRepository {
  private toDomain(prismaFaq: PrismaFAQ): FAQ {
    return new FAQ(
      prismaFaq.id,
      prismaFaq.category,
      prismaFaq.question,
      prismaFaq.answer,
      prismaFaq.sortOrder,
      prismaFaq.isActive,
      prismaFaq.viewCount,
      prismaFaq.createdAt || new Date(),
      prismaFaq.updatedAt || new Date()
    );
  }

  async findById(id: number): Promise<FAQ | null> {
    const faq = await prisma.faq.findUnique({
      where: { id }
    });

    return faq ? this.toDomain(faq) : null;
  }

  async findByCategory(category: string): Promise<FAQ[]> {
    const faqs = await prisma.faq.findMany({
      where: { 
        category,
        isActive: true 
      },
      orderBy: [
        { sortOrder: 'asc' },
        { createdAt: 'desc' }
      ]
    });

    return faqs.map(faq => this.toDomain(faq));
  }

  async findAll(onlyActive: boolean = true): Promise<FAQ[]> {
    const faqs = await prisma.faq.findMany({
      where: onlyActive ? { isActive: true } : undefined,
      orderBy: [
        { category: 'asc' },
        { sortOrder: 'asc' },
        { createdAt: 'desc' }
      ]
    });

    return faqs.map(faq => this.toDomain(faq));
  }

  async getCategories(): Promise<string[]> {
    const result = await prisma.faq.findMany({
      where: { isActive: true },
      select: { category: true },
      distinct: ['category'],
      orderBy: { category: 'asc' }
    });

    return result.map(item => item.category);
  }

  async save(faq: FAQ): Promise<FAQ> {
    const savedFaq = await prisma.faq.create({
      data: {
        category: faq.category,
        question: faq.question,
        answer: faq.answer,
        sortOrder: faq.sortOrder,
        isActive: faq.isActive,
        viewCount: faq.viewCount
      }
    });

    return this.toDomain(savedFaq);
  }

  async update(faq: FAQ): Promise<void> {
    await prisma.faq.update({
      where: { id: faq.id },
      data: {
        category: faq.category,
        question: faq.question,
        answer: faq.answer,
        sortOrder: faq.sortOrder,
        isActive: faq.isActive,
        viewCount: faq.viewCount
      }
    });
  }

  async delete(id: number): Promise<void> {
    await prisma.faq.delete({
      where: { id }
    });
  }

  async search(query: string): Promise<FAQ[]> {
    const faqs = await prisma.faq.findMany({
      where: {
        isActive: true,
        OR: [
          { question: { contains: query } },
          { answer: { contains: query } },
          { category: { contains: query } }
        ]
      },
      orderBy: [
        { sortOrder: 'asc' },
        { createdAt: 'desc' }
      ]
    });

    return faqs.map(faq => this.toDomain(faq));
  }
}