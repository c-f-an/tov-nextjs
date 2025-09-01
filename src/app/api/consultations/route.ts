import { NextRequest, NextResponse } from 'next/server';
import { getContainer } from '@/infrastructure/config/getContainer';
import { withAuth } from '@/presentation/middleware/authMiddleware';

export async function GET(request: NextRequest) {
  try {
    const user = await withAuth(request);
    const searchParams = request.nextUrl.searchParams;
    const page = searchParams.get('page');
    const limit = searchParams.get('limit');
    const status = searchParams.get('status');

    const container = getContainer();
    const getConsultationsUseCase = container.getGetConsultationsUseCase();
    
    const result = await getConsultationsUseCase.execute({
      userId: user?.id,
      status: status as any,
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 10
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching consultations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch consultations' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await withAuth(request);
    const body = await request.json();

    // Validate required fields
    const requiredFields = ['name', 'phone', 'consultationType', 'title', 'content', 'privacyAgree'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    const createConsultationUseCase = container.getCreateConsultationUseCase();
    
    const consultation = await createConsultationUseCase.execute({
      ...body,
      userId: user?.id,
      preferredDate: body.preferredDate ? new Date(body.preferredDate) : undefined
    });

    return NextResponse.json(consultation, { status: 201 });
  } catch (error: any) {
    console.error('Error creating consultation:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create consultation' },
      { status: 400 }
    );
  }
}