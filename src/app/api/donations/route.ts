import { NextRequest, NextResponse } from 'next/server';
import { getContainer } from '@/infrastructure/config/getContainer';
import { withAuth } from '@/presentation/middleware/authMiddleware';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const sponsorId = searchParams.get('sponsorId');
    const page = searchParams.get('page');
    const limit = searchParams.get('limit');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    const container = getContainer();
    const getDonationsUseCase = container.getGetDonationsUseCase();
    
    const result = await getDonationsUseCase.execute({
      sponsorId: sponsorId ? parseInt(sponsorId) : undefined,
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 10,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching donations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch donations' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const requiredFields = ['sponsorId', 'donationType', 'amount', 'paymentDate'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    const createDonationUseCase = container.getCreateDonationUseCase();
    
    const donation = await createDonationUseCase.execute({
      ...body,
      paymentDate: new Date(body.paymentDate)
    });

    return NextResponse.json(donation, { status: 201 });
  } catch (error: any) {
    console.error('Error creating donation:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create donation' },
      { status: 400 }
    );
  }
}