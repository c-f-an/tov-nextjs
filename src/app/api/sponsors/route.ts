import { NextRequest, NextResponse } from 'next/server';
import { getContainer } from '@/infrastructure/config/getContainer';
import { withAuth } from '@/presentation/middleware/authMiddleware';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const requiredFields = ['sponsorType', 'name', 'privacyAgree'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    const user = await withAuth(request);
    const container = getContainer();
    const createSponsorUseCase = container.getCreateSponsorUseCase();
    
    const sponsor = await createSponsorUseCase.execute({
      ...body,
      userId: user?.id
    });

    return NextResponse.json(sponsor, { status: 201 });
  } catch (error: any) {
    console.error('Error creating sponsor:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create sponsor' },
      { status: 400 }
    );
  }
}