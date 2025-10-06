import { NextRequest, NextResponse } from 'next/server';
import { getContainer } from '@/infrastructure/config/getContainer';
import { withAuth } from '@/presentation/middleware/authMiddleware';
import { MySQLConsultationRepository } from '@/infrastructure/repositories/MySQLConsultationRepository';
import { ConsultationStatus } from '@/core/domain/entities/Consultation';
import { cookies } from 'next/headers';
import { verifyAccessToken } from '@/lib/auth-utils';

const consultationRepository = new MySQLConsultationRepository();

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

// PATCH - Update consultation (status, memo, etc.)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify admin access
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;

    if (!accessToken) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const jwtSecret = process.env.JWT_ACCESS_SECRET || 'default-access-secret';
    const tokenPayload = verifyAccessToken(accessToken, jwtSecret);

    if (!tokenPayload || tokenPayload.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const consultation = await consultationRepository.findById(id);

    if (!consultation) {
      return NextResponse.json(
        { error: 'Consultation not found' },
        { status: 404 }
      );
    }

    // Update fields
    if (body.status) {
      consultation.status = body.status as ConsultationStatus;
    }

    if (body.consultationNote !== undefined) {
      consultation.consultationNote = body.consultationNote;
    }

    if (body.counselorId !== undefined) {
      consultation.counselorId = body.counselorId;
    }

    // If status is changed to completed, set completedAt
    if (body.status === 'completed' && !consultation.completedAt) {
      consultation.completedAt = new Date();
    }

    await consultationRepository.update(consultation);

    return NextResponse.json({
      success: true,
      consultation
    });
  } catch (error) {
    console.error('Error updating consultation:', error);
    return NextResponse.json(
      { error: 'Failed to update consultation' },
      { status: 500 }
    );
  }
}