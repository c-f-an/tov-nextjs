import { NextRequest, NextResponse } from 'next/server';
import { getContainer } from '@/infrastructure/config/getContainer';
import { Container } from '@/infrastructure/config/container';
import { cookies } from 'next/headers';
import { verifyAccessToken } from '@/lib/auth-utils';
import { query, queryOne } from '@/infrastructure/database/mysql';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Check if this is an admin request
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;
    let isAdminRequest = false;

    if (accessToken) {
      const jwtSecret = process.env.JWT_ACCESS_SECRET || 'default-access-secret';
      const tokenPayload = verifyAccessToken(accessToken, jwtSecret);
      isAdminRequest = tokenPayload?.role === 'ADMIN';
    }

    // Different validation for admin vs regular users
    if (isAdminRequest) {
      // Admin creating sponsor for donation
      const requiredFields = ['name', 'phone'];
      for (const field of requiredFields) {
        if (!body[field]) {
          return NextResponse.json(
            { error: `${field} is required` },
            { status: 400 }
          );
        }
      }

      // Check if sponsor with the same phone already exists
      const existingSponsor = await queryOne(
        'SELECT * FROM sponsors WHERE phone = ?',
        [body.phone]
      );

      if (existingSponsor) {
        // Return existing sponsor
        return NextResponse.json(existingSponsor, { status: 200 });
      }

      // Create new sponsor directly for admin
      const result = await query(
        `INSERT INTO sponsors (name, email, phone, sponsor_type, organization_name, sponsor_status, privacy_agree, receipt_required, resident_registration_number, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [
          body.name,
          body.email || null,
          body.phone,
          body.organizationName ? 'organization' : 'individual',
          body.organizationName || null,
          'active',
          1,  // privacy_agree
          body.receiptRequired ? 1 : 0,
          body.residentRegistrationNumber || null
        ]
      );

      const newSponsor = await queryOne(
        'SELECT * FROM sponsors WHERE id = ?',
        [(result as any).insertId]
      );

      return NextResponse.json(newSponsor, { status: 201 });

    } else {
      // Regular user sponsor registration
      const requiredFields = ['sponsorType', 'name', 'privacyAgree'];
      for (const field of requiredFields) {
        if (!body[field]) {
          return NextResponse.json(
            { error: `${field} is required` },
            { status: 400 }
          );
        }
      }

      // Get user from authorization header
      const authHeader = request.headers.get('authorization');
      let userId: number | null = null;

      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        const container = Container.getInstance();
        const authService = container.getAuthService();

        try {
          const payload = await authService.verifyAccessToken(token);
          if (payload && typeof payload.userId === 'number') {
            userId = payload.userId;
          }
        } catch (error) {
          console.error('Token verification failed:', error);
        }
      }

      const container = getContainer();
      const sponsorRepository = container.getSponsorRepository();

      // Check if sponsor already exists (prevent race condition)
      // 1. First check by userId if available
      if (userId) {
        const existingSponsors = await sponsorRepository.findByUserId(userId);
        if (existingSponsors && existingSponsors.length > 0) {
          // Return existing sponsor
          return NextResponse.json(existingSponsors[0], { status: 200 });
        }
      }

      // 2. Also check by phone to prevent duplicate sponsors with same phone
      if (body.phone) {
        const existingSponsor = await queryOne(
          'SELECT * FROM sponsors WHERE phone = ?',
          [body.phone]
        );

        if (existingSponsor) {
          // Return existing sponsor
          return NextResponse.json(existingSponsor, { status: 200 });
        }
      }

      // Create new sponsor
      try {
        const createSponsorUseCase = container.getCreateSponsorUseCase();

        const sponsor = await createSponsorUseCase.execute({
          ...body,
          userId
        });

        return NextResponse.json(sponsor, { status: 201 });
      } catch (error: any) {
        // Handle lock wait timeout or duplicate key errors gracefully
        if (error.message && (
          error.message.includes('Lock wait timeout') ||
          error.message.includes('Duplicate entry')
        )) {
          // If lock timeout or duplicate, try to fetch existing sponsor
          if (userId) {
            const existingSponsors = await sponsorRepository.findByUserId(userId);
            if (existingSponsors && existingSponsors.length > 0) {
              return NextResponse.json(existingSponsors[0], { status: 200 });
            }
          }
          if (body.phone) {
            const existingSponsor = await queryOne(
              'SELECT * FROM sponsors WHERE phone = ?',
              [body.phone]
            );
            if (existingSponsor) {
              return NextResponse.json(existingSponsor, { status: 200 });
            }
          }
        }
        // Re-throw if we couldn't handle it
        throw error;
      }
    }
  } catch (error: any) {
    console.error('Error creating sponsor:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create sponsor' },
      { status: 400 }
    );
  }
}