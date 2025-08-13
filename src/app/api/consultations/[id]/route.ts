import { NextRequest, NextResponse } from 'next/server';
import { container } from '@/infrastructure/config/container.tsyringe';
import { GetConsultationUseCase } from '@/core/application/use-cases/consultation/GetConsultationUseCase';
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

    const getConsultationUseCase = container.resolve(GetConsultationUseCase);
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