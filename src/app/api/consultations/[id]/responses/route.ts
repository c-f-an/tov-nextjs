import { NextRequest, NextResponse } from 'next/server';
import { getContainer } from '@/infrastructure/config/getContainer';
import { cookies } from 'next/headers';
import { verifyAccessToken } from '@/lib/auth-utils';
import { ResponseType } from '@/core/domain/entities/ConsultationResponse';

async function getCurrentUser() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;
  if (!accessToken) return null;
  const payload = verifyAccessToken(accessToken, process.env.JWT_ACCESS_SECRET || 'default-access-secret');
  if (!payload) return null;
  return { userId: payload.userId, role: payload.role, email: payload.email };
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

// POST /api/consultations/[id]/responses - 답변 등록 (어드민) 또는 추가 질문 등록 (상담 신청자)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
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
    const isAdmin = user.role === 'ADMIN';

    if (!isAdmin) {
      // 일반 유저: 추가 질문(type=4)만 허용
      const responseType = body.responseType ? Number(body.responseType) : ResponseType.QUESTION;
      if (responseType !== ResponseType.QUESTION) {
        return NextResponse.json({ error: '유저는 추가 질문만 등록할 수 있습니다.' }, { status: 403 });
      }

      // 상담 소유권 확인 (해당 상담의 신청자인지)
      const getConsultationUseCase = container.getGetConsultationUseCase();
      let consultation;
      try {
        consultation = await getConsultationUseCase.execute(consultationId, user.userId);
      } catch {
        return NextResponse.json({ error: '상담을 찾을 수 없거나 접근 권한이 없습니다.' }, { status: 403 });
      }
      if (!consultation) {
        return NextResponse.json({ error: '상담을 찾을 수 없습니다.' }, { status: 404 });
      }

      // 진행 중인 상담에만 추가 질문 가능
      const activeStatuses = ['pending', 'assigned', 'in_progress'];
      if (!activeStatuses.includes(consultation.status)) {
        return NextResponse.json({ error: '완료되거나 취소된 상담에는 질문을 추가할 수 없습니다.' }, { status: 400 });
      }

      const useCase = container.getCreateConsultationResponseUseCase();
      const response = await useCase.execute({
        consultationId,
        responderId: user.userId ?? undefined,
        responderName: user.email || undefined,
        responseType: ResponseType.QUESTION,
        content: body.content,
        isPublic: true, // 유저 추가 질문은 항상 공개
      });

      return NextResponse.json(response, { status: 201 });
    }

    // 어드민: 모든 타입 허용
    const useCase = container.getCreateConsultationResponseUseCase();
    const response = await useCase.execute({
      consultationId,
      responderId: user.userId ?? undefined,
      responderName: user.email || undefined,
      responseType: body.responseType as ResponseType | undefined,
      content: body.content,
      isPublic: body.isPublic ?? false,
    });

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('Error creating consultation response:', error);
    const message = error instanceof Error ? error.message : 'Failed to create response';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
