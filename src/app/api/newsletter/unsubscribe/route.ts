import { getContainer } from '@/infrastructure/config/getContainer';
import { NextRequest, NextResponse } from 'next/server';

import { INewsletterSubscriberRepository } from '@/core/domain/repositories/INewsletterSubscriberRepository';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (!body.email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const container = getContainer();
    const subscriberRepository = container.getNewsletterSubscriberRepository();
    const subscriber = await subscriberRepository.findByEmail(body.email);

    if (!subscriber) {
      return NextResponse.json(
        { error: 'Email not found in subscriber list' },
        { status: 404 }
      );
    }

    if (!subscriber.isActive) {
      return NextResponse.json(
        { message: 'Already unsubscribed' },
        { status: 200 }
      );
    }

    // Unsubscribe
    subscriber.unsubscribe();
    await subscriberRepository.update(subscriber);

    return NextResponse.json({
      message: 'Successfully unsubscribed from newsletter'
    });
  } catch (error) {
    console.error('Error unsubscribing from newsletter:', error);
    return NextResponse.json(
      { error: 'Failed to unsubscribe from newsletter' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    
    if (!email) {
      return NextResponse.json(
        { error: 'Email parameter is required' },
        { status: 400 }
      );
    }

    const subscriberRepository = container.getNewsletterSubscriberRepository();
    const subscriber = await subscriberRepository.findByEmail(email);

    if (!subscriber) {
      return NextResponse.json(
        { error: 'Email not found in subscriber list' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      email: subscriber.email,
      isActive: subscriber.isActive,
      subscribedAt: subscriber.subscribedAt,
      unsubscribedAt: subscriber.unsubscribedAt
    });
  } catch (error) {
    console.error('Error checking subscription status:', error);
    return NextResponse.json(
      { error: 'Failed to check subscription status' },
      { status: 500 }
    );
  }
}