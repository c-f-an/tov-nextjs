import { NextRequest, NextResponse } from 'next/server';
import { getContainer } from '@/infrastructure/config/getContainer';
import { MySQLConsultationRepository } from '@/infrastructure/repositories/MySQLConsultationRepository';
import { ConsultationStatus } from '@/core/domain/entities/Consultation';
import { cookies } from 'next/headers';
import { verifyAccessToken } from '@/lib/auth-utils';

const consultationRepository = new MySQLConsultationRepository();

async function getCurrentUserPayload() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;
  if (!accessToken) return null;
  return verifyAccessToken(accessToken, process.env.JWT_ACCESS_SECRET || 'default-access-secret');
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const payload = await getCurrentUserPayload();
    const isAdmin = payload?.role === 'ADMIN';
    // 어드민은 전체 조회 가능, 일반 유저는 본인 상담만 조회
    const userId = isAdmin ? undefined : (payload?.userId ?? undefined);
    const { id } = await params;
    const consultationId = parseInt(id);

    if (isNaN(consultationId)) {
      return NextResponse.json(
        { error: 'Invalid consultation ID' },
        { status: 400 }
      );
    }

    const container = getContainer();
    const getConsultationUseCase = container.getGetConsultationUseCase();
    const consultation = await getConsultationUseCase.execute(consultationId, userId);

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
    const consultation = await consultationRepository.findById(parseInt(id));

    if (!consultation) {
      return NextResponse.json(
        { error: 'Consultation not found' },
        { status: 404 }
      );
    }

    let updated = consultation;

    if (body.status === ConsultationStatus.completed && consultation.status !== ConsultationStatus.completed) {
      updated = updated.complete(body.consultationNotes ?? consultation.consultationNotes ?? '');
    } else if (body.status === ConsultationStatus.cancelled) {
      updated = updated.cancel();
    } else if (body.status) {
      updated = updated.withStatus(body.status as ConsultationStatus);
    }

    if (body.assignedTo !== undefined) {
      updated = updated.assign(body.assignedTo);
    }

    await consultationRepository.update(updated);

    return NextResponse.json({
      success: true,
      consultation: updated
    });
  } catch (error) {
    console.error('Error updating consultation:', error);
    return NextResponse.json(
      { error: 'Failed to update consultation' },
      { status: 500 }
    );
  }
}