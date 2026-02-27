import { NextRequest, NextResponse } from 'next/server';
import { getContainer } from '@/infrastructure/config/getContainer';
import { cookies } from 'next/headers';
import { verifyAccessToken } from '@/lib/auth-utils';
import { MeetingType } from '@/core/domain/entities/ConsultationFollowup';

async function verifyAdmin() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;
  if (!accessToken) return null;
  const jwtSecret = process.env.JWT_ACCESS_SECRET || 'default-access-secret';
  const payload = verifyAccessToken(accessToken, jwtSecret);
  return payload?.role === 'ADMIN' ? payload : null;
}

// GET /api/consultations/[id]/followups - 후속 모임 목록 조회
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const consultationId = parseInt(id);
    if (isNaN(consultationId)) {
      return NextResponse.json({ error: 'Invalid consultation ID' }, { status: 400 });
    }

    const container = getContainer();
    const useCase = container.getGetConsultationFollowupsUseCase();
    const followups = await useCase.execute(consultationId);
    return NextResponse.json(followups);
  } catch (error) {
    console.error('Error fetching consultation followups:', error);
    return NextResponse.json({ error: 'Failed to fetch followups' }, { status: 500 });
  }
}

// POST /api/consultations/[id]/followups - 후속 모임 등록 (어드민 전용)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await verifyAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { id } = await params;
    const consultationId = parseInt(id);
    if (isNaN(consultationId)) {
      return NextResponse.json({ error: 'Invalid consultation ID' }, { status: 400 });
    }

    const body = await request.json();
    const container = getContainer();
    const useCase = container.getCreateConsultationFollowupUseCase();
    const followup = await useCase.execute({
      originalConsultationId: consultationId,
      followupConsultationId: body.followupConsultationId ?? undefined,
      meetingType: body.meetingType as MeetingType | undefined,
      scheduledAt: body.scheduledAt ? new Date(body.scheduledAt) : undefined,
      topic: body.topic ?? undefined,
      notes: body.notes ?? undefined,
      assignedTo: body.assignedTo ?? undefined,
    });

    return NextResponse.json(followup, { status: 201 });
  } catch (error: any) {
    console.error('Error creating consultation followup:', error);
    return NextResponse.json({ error: error.message || 'Failed to create followup' }, { status: 400 });
  }
}
