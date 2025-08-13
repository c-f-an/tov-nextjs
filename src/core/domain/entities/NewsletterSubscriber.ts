export class NewsletterSubscriber {
  constructor(
    public readonly id: number,
    public readonly email: string,
    public name: string | null,
    public isActive: boolean,
    public readonly subscribedAt: Date,
    public unsubscribedAt: Date | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  static create(data: {
    email: string;
    name?: string | null;
  }): NewsletterSubscriber {
    return new NewsletterSubscriber(
      0,
      data.email,
      data.name || null,
      true,
      new Date(),
      null,
      new Date(),
      new Date()
    );
  }

  updateName(name: string | null): void {
    this.name = name;
  }

  subscribe(): void {
    this.isActive = true;
    this.unsubscribedAt = null;
  }

  unsubscribe(): void {
    this.isActive = false;
    this.unsubscribedAt = new Date();
  }

  isSubscribed(): boolean {
    return this.isActive;
  }
}