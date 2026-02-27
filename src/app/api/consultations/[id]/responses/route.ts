import { NextRequest, NextResponse } from 'next/server';
import { getContainer } from '@/infrastructure/config/getContainer';
import { cookies } from 'next/headers';
import { verifyAccessToken } from '@/lib/auth-utils';
import { ResponseType } from '@/core/domain/entities/ConsultationResponse';

async function verifyAdmin() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;
  if (!accessToken) return null;
  const jwtSecret = process.env.JWT_ACCESS_SECRET || 'default-access-secret';
  const payload = verifyAccessToken(accessToken, jwtSecret);
  return payload?.role === 'ADMIN' ? payload : null;
}

// GET /api/consultations/[id]/responses - 답변 목록 조회
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
    const useCase = container.getGetConsultationResponsesUseCase();
    const responses = await useCase.execute(consultationId);
    return NextResponse.json(responses);
  } catch (error) {
    console.error('Error fetching consultation responses:', error);
    return NextResponse.json({ error: 'Failed to fetch responses' }, { status: 500 });
  }
}

// POST /api/consultations/[id]/responses - 답변 등록 (어드민 전용)
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
    if (!body.content) {
      return NextResponse.json({ error: 'content is required' }, { status: 400 });
    }

    const container = getContainer();
    const useCase = container.getCreateConsultationResponseUseCase();
    const response = await useCase.execute({
      consultationId,
      responderId: admin.userId ?? undefined,
      responderName: admin.email || undefined,
      responseType: body.responseType as ResponseType | undefined,
      content: body.content,
      isPublic: body.isPublic ?? false,
    });

    return NextResponse.json(response, { status: 201 });
  } catch (error: any) {
    console.error('Error creating consultation response:', error);
    return NextResponse.json({ error: error.message || 'Failed to create response' }, { status: 400 });
  }
}
