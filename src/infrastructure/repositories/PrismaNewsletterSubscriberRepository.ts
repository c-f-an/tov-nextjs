import { NewsletterSubscriber } from '@/core/domain/entities/NewsletterSubscriber';
import { INewsletterSubscriberRepository } from '@/core/domain/repositories/INewsletterSubscriberRepository';
import { prisma } from '../database/prisma';
import { NewsletterSubscriber as PrismaNewsletterSubscriber } from '@prisma/client';

export class PrismaNewsletterSubscriberRepository implements INewsletterSubscriberRepository {
  private toDomain(prismaSubscriber: PrismaNewsletterSubscriber): NewsletterSubscriber {
    return new NewsletterSubscriber(
      prismaSubscriber.id,
      prismaSubscriber.email,
      prismaSubscriber.name,
      prismaSubscriber.isActive,
      prismaSubscriber.subscribedAt,
      prismaSubscriber.unsubscribedAt,
      prismaSubscriber.createdAt || new Date(),
      prismaSubscriber.updatedAt || new Date()
    );
  }

  async findById(id: number): Promise<NewsletterSubscriber | null> {
    const subscriber = await prisma.newsletterSubscriber.findUnique({
      where: { id }
    });

    return subscriber ? this.toDomain(subscriber) : null;
  }

  async findByEmail(email: string): Promise<NewsletterSubscriber | null> {
    const subscriber = await prisma.newsletterSubscriber.findUnique({
      where: { email }
    });

    return subscriber ? this.toDomain(subscriber) : null;
  }

  async findAll(onlyActive: boolean = true): Promise<NewsletterSubscriber[]> {
    const subscribers = await prisma.newsletterSubscriber.findMany({
      where: onlyActive ? { isActive: true } : undefined,
      orderBy: { subscribedAt: 'desc' }
    });

    return subscribers.map(subscriber => this.toDomain(subscriber));
  }

  async save(subscriber: NewsletterSubscriber): Promise<NewsletterSubscriber> {
    const savedSubscriber = await prisma.newsletterSubscriber.create({
      data: {
        email: subscriber.email,
        name: subscriber.name,
        isActive: subscriber.isActive,
        subscribedAt: subscriber.subscribedAt,
        unsubscribedAt: subscriber.unsubscribedAt
      }
    });

    return this.toDomain(savedSubscriber);
  }

  async update(subscriber: NewsletterSubscriber): Promise<void> {
    await prisma.newsletterSubscriber.update({
      where: { id: subscriber.id },
      data: {
        email: subscriber.email,
        name: subscriber.name,
        isActive: subscriber.isActive,
        unsubscribedAt: subscriber.unsubscribedAt
      }
    });
  }

  async delete(id: number): Promise<void> {
    await prisma.newsletterSubscriber.delete({
      where: { id }
    });
  }

  async countActive(): Promise<number> {
    return await prisma.newsletterSubscriber.count({
      where: { isActive: true }
    });
  }

  async getRecentSubscribers(days: number): Promise<NewsletterSubscriber[]> {
    const since = new Date();
    since.setDate(since.getDate() - days);

    const subscribers = await prisma.newsletterSubscriber.findMany({
      where: {
        subscribedAt: {
          gte: since
        }
      },
      orderBy: { subscribedAt: 'desc' }
    });

    return subscribers.map(subscriber => this.toDomain(subscriber));
  }
}