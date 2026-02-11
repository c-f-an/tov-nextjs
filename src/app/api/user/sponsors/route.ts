import { NextRequest, NextResponse } from 'next/server';
import { Container } from '@/infrastructure/config/container';
import { getContainer } from '@/infrastructure/config/getContainer';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const container = Container.getInstance();
    const authService = container.getAuthService();
    const payload = await authService.verifyAccessToken(token);

    if (!payload || typeof payload.userId !== 'number') {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const sponsorRepository = getContainer().getSponsorRepository();
    const sponsors = await sponsorRepository.findByUserId(payload.userId);

    // Return the most recent sponsor (if any)
    const sponsor = sponsors.length > 0 ? sponsors[0] : null;

    return NextResponse.json({ sponsor }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching user sponsors:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch sponsors' },
      { status: 500 }
    );
  }
}
