import { NextRequest, NextResponse } from 'next/server';
import { getContainer } from '@/infrastructure/config/getContainer';
import { cookies } from 'next/headers';
import { verifyAccessToken } from '@/lib/auth-utils';
import { ConsultationStatus } from '@/core/domain/entities/Consultation';

async function getCurrentUserPayload() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;
  if (!accessToken) return null;
  return verifyAccessToken(accessToken, process.env.JWT_ACCESS_SECRET || 'default-access-secret');
}

export async function GET(request: NextRequest) {
  try {
    const payload = await getCurrentUserPayload();
    const userId = payload?.userId ?? undefined;
    const searchParams = request.nextUrl.searchParams;
    const page = searchParams.get('page');
    const limit = searchParams.get('limit');
    const status = searchParams.get('status');

    const container = getContainer();
    const getConsultationsUseCase = container.getGetConsultationsUseCase();

    const result = await getConsultationsUseCase.execute({
      userId,
      status: status as ConsultationStatus | undefined,
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
    const payload = await getCurrentUserPayload();
    const body = await request.json();

    const requiredFields = ['name', 'phone', 'consultationType', 'title', 'content', 'privacyAgree'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // 어드민이 등록하는 경우: body.linkedUserId를 userId로 사용 (없으면 null)
    // 일반 유저가 등록하는 경우: 쿠키의 userId를 사용
    const isAdmin = payload?.role === 'ADMIN';
    let userId: number | undefined;
    if (isAdmin) {
      userId = body.linkedUserId ? Number(body.linkedUserId) : undefined;
    } else {
      userId = payload?.userId ?? undefined;
    }

    const container = getContainer();
    const createConsultationUseCase = container.getCreateConsultationUseCase();

    const consultation = await createConsultationUseCase.execute({
      ...body,
      userId,
      preferredDate: body.preferredDate ? new Date(body.preferredDate) : undefined
    });

    return NextResponse.json(consultation, { status: 201 });
  } catch (error) {
    console.error('Error creating consultation:', error);
    const message = error instanceof Error ? error.message : 'Failed to create consultation';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}