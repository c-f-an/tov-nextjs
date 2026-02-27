import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { RegisterUseCase } from '@/core/application/use-cases/auth/RegisterUseCase';
import { Container } from '@/infrastructure/config/container';

const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(1, 'Name is required'),
  phoneNumber: z.string().optional(),
  churchName: z.string().optional(),
  position: z.string().optional(),
  userType: z.number().int().min(0).max(3).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request body
    const validatedData = registerSchema.parse(body);
    
    // Get client info
    const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const userAgent = request.headers.get('user-agent') || undefined;
    
    // Get use case from container
    const container = Container.getInstance();
    const registerUseCase = container.getRegisterUseCase();
    
    // Execute use case
    const result = await registerUseCase.execute(validatedData, ipAddress, userAgent);
    
    // Set tokens as HTTP-only cookies
    const response = NextResponse.json({
      user: result.user,
      accessToken: result.tokens.accessToken
    }, { status: 201 });

    // Set access token cookie
    response.cookies.set('accessToken', result.tokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60, // 15 minutes
      path: '/'
    });

    // Set refresh token cookie
    response.cookies.set('refreshToken', result.tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/'
    });
    
    return response;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      );
    }
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}