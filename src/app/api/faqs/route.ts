import { NextRequest, NextResponse } from 'next/server';
import { getContainer } from '@/infrastructure/config/getContainer';
import { FAQ } from '@/core/domain/entities/FAQ';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const includeInactive = searchParams.get('includeInactive') === 'true';

    const container = getContainer();
    const faqRepository = container.getFAQRepository();

    let faqs: FAQ[];
    
    if (search) {
      faqs = await faqRepository.search(search);
    } else if (category) {
      faqs = await faqRepository.findByCategory(category);
    } else {
      faqs = await faqRepository.findAll(!includeInactive);
    }

    // Group by category
    const groupedFaqs = faqs.reduce((acc, faq) => {
      if (!acc[faq.category]) {
        acc[faq.category] = [];
      }
      acc[faq.category].push({
        id: faq.id,
        question: faq.question,
        answer: faq.answer,
        sortOrder: faq.sortOrder,
        isActive: faq.isActive,
        viewCount: faq.viewCount
      });
      return acc;
    }, {} as Record<string, any[]>);

    return NextResponse.json({
      faqs: groupedFaqs,
      categories: await faqRepository.getCategories()
    });
  } catch (error) {
    console.error('Error fetching FAQs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch FAQs' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
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

    const body = await request.json();
    
    if (!body.category || !body.question || !body.answer) {
      return NextResponse.json(
        { error: 'Category, question, and answer are required' },
        { status: 400 }
      );
    }

    const faqRepository = container.getFAQRepository();
    
    const newFaq = FAQ.create({
      category: body.category,
      question: body.question,
      answer: body.answer,
      sortOrder: body.sortOrder || 0,
      isActive: body.isActive !== undefined ? body.isActive : true
    });

    const savedFaq = await faqRepository.save(newFaq);

    return NextResponse.json({
      faq: {
        id: savedFaq.id,
        category: savedFaq.category,
        question: savedFaq.question,
        answer: savedFaq.answer,
        sortOrder: savedFaq.sortOrder,
        isActive: savedFaq.isActive,
        viewCount: savedFaq.viewCount,
        createdAt: savedFaq.createdAt,
        updatedAt: savedFaq.updatedAt
      }
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating FAQ:', error);
    return NextResponse.json(
      { error: 'Failed to create FAQ' },
      { status: 500 }
    );
  }
}