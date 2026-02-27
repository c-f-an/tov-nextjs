import { NextRequest, NextResponse } from 'next/server';
import { getContainer } from '@/infrastructure/config/getContainer';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const faqId = parseInt(id);

    if (isNaN(faqId)) {
      return NextResponse.json(
        { error: 'Invalid FAQ ID' },
        { status: 400 }
      );
    }

    const container = getContainer();
    const faqRepository = container.getFAQRepository();
    const faq = await faqRepository.findById(faqId);

    if (!faq) {
      return NextResponse.json(
        { error: 'FAQ not found' },
        { status: 404 }
      );
    }

    // Increment view count
    faq.incrementViewCount();
    await faqRepository.update(faq);

    return NextResponse.json({
      faq: {
        id: faq.id,
        category: faq.category,
        question: faq.question,
        answer: faq.answer,
        sortOrder: faq.sortOrder,
        isActive: faq.isActive,
        viewCount: faq.viewCount,
        createdAt: faq.createdAt,
        updatedAt: faq.updatedAt
      }
    });
  } catch (error) {
    console.error('Error fetching FAQ:', error);
    return NextResponse.json(
      { error: 'Failed to fetch FAQ' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    // Check authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const container = getContainer();
    const authService = container.getAuthService();
    const payload = await authService.verifyAccessToken(token);

    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const faqId = parseInt(id);

    if (isNaN(faqId)) {
      return NextResponse.json(
        { error: 'Invalid FAQ ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const faqRepository = container.getFAQRepository();
    const faq = await faqRepository.findById(faqId);

    if (!faq) {
      return NextResponse.json(
        { error: 'FAQ not found' },
        { status: 404 }
      );
    }

    // Update FAQ
    faq.updateContent({
      category: body.category,
      question: body.question,
      answer: body.answer
    });

    if (body.sortOrder !== undefined) {
      faq.updateSortOrder(body.sortOrder);
    }

    if (body.isActive !== undefined) {
      if (body.isActive) {
        faq.activate();
      } else {
        faq.deactivate();
      }
    }

    await faqRepository.update(faq);

    return NextResponse.json({
      faq: {
        id: faq.id,
        category: faq.category,
        question: faq.question,
        answer: faq.answer,
        sortOrder: faq.sortOrder,
        isActive: faq.isActive,
        viewCount: faq.viewCount,
        createdAt: faq.createdAt,
        updatedAt: faq.updatedAt
      }
    });
  } catch (error) {
    console.error('Error updating FAQ:', error);
    return NextResponse.json(
      { error: 'Failed to update FAQ' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    // Check authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const container = getContainer();
    const authService = container.getAuthService();
    const payload = await authService.verifyAccessToken(token);

    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const faqId = parseInt(id);

    if (isNaN(faqId)) {
      return NextResponse.json(
        { error: 'Invalid FAQ ID' },
        { status: 400 }
      );
    }

    const faqRepository = container.getFAQRepository();
    const faq = await faqRepository.findById(faqId);

    if (!faq) {
      return NextResponse.json(
        { error: 'FAQ not found' },
        { status: 404 }
      );
    }

    await faqRepository.delete(faqId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting FAQ:', error);
    return NextResponse.json(
      { error: 'Failed to delete FAQ' },
      { status: 500 }
    );
  }
}
