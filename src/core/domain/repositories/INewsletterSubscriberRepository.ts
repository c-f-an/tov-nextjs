import { NewsletterSubscriber } from '../entities/NewsletterSubscriber';

interface INewsletterSubscriberRepository {
  findById(id: number): Promise<NewsletterSubscriber | null>;
  findByEmail(email: string): Promise<NewsletterSubscriber | null>;
  findAll(onlyActive?: boolean): Promise<NewsletterSubscriber[]>;
  save(subscriber: NewsletterSubscriber): Promise<NewsletterSubscriber>;
  update(subscriber: NewsletterSubscriber): Promise<void>;
  delete(id: number): Promise<void>;
  countActive(): Promise<number>;
  getRecentSubscribers(days: number): Promise<NewsletterSubscriber[]>;
}

export type { INewsletterSubscriberRepository };