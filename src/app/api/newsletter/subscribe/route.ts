import { NextRequest, NextResponse } from 'next/server';
import { container } from '@/infrastructure/config/container.tsyringe';
import { INewsletterSubscriberRepository } from '@/core/domain/repositories/INewsletterSubscriberRepository';
import { NewsletterSubscriber } from '@/core/domain/entities/NewsletterSubscriber';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (!body.email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    const subscriberRepository = container.resolve<INewsletterSubscriberRepository>('INewsletterSubscriberRepository');
    
    // Check if already subscribed
    const existingSubscriber = await subscriberRepository.findByEmail(body.email);
    
    if (existingSubscriber) {
      if (existingSubscriber.isActive) {
        return NextResponse.json(
          { error: 'This email is already subscribed' },
          { status: 400 }
        );
      } else {
        // Reactivate subscription
        existingSubscriber.subscribe();
        await subscriberRepository.update(existingSubscriber);
        
        return NextResponse.json({
          message: 'Successfully resubscribed to newsletter',
          subscriber: {
            email: existingSubscriber.email,
            name: existingSubscriber.name
          }
        });
      }
    }

    // Create new subscriber
    const newSubscriber = NewsletterSubscriber.create({
      email: body.email,
      name: body.name
    });

    const savedSubscriber = await subscriberRepository.save(newSubscriber);

    return NextResponse.json({
      message: 'Successfully subscribed to newsletter',
      subscriber: {
        email: savedSubscriber.email,
        name: savedSubscriber.name
      }
    }, { status: 201 });
  } catch (error) {
    console.error('Error subscribing to newsletter:', error);
    return NextResponse.json(
      { error: 'Failed to subscribe to newsletter' },
      { status: 500 }
    );
  }
}