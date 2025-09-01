import { NextRequest, NextResponse } from 'next/server';
import { getContainer } from '@/infrastructure/config/getContainer';
import { withAuth } from '@/presentation/middleware/authMiddleware';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await withAuth(request);
    const consultationId = parseInt(params.id);
    
    if (isNaN(consultationId)) {
      return NextResponse.json(
        { error: 'Invalid consultation ID' },
        { status: 400 }
      );
    }

    const container = getContainer();
    const getConsultationUseCase = container.getGetConsultationUseCase();
    const consultation = await getConsultationUseCase.execute(consultationId, user?.id);

    if (!consultation) {
      return NextResponse.json(
        { error: 'Consultation not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(consultation);
  } catch (error: any) {
    console.error('Error fetching consultation:', error);
    
    if (error.message === 'Unauthorized to view this consultation') {
      return NextResponse.json(
        { error: error.message },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to fetch consultation' },
      { status: 500 }
    );
  }
}