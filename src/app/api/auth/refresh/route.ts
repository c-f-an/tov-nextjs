import { NextRequest, NextResponse } from 'next/server';
import { RefreshTokenUseCase } from '@/core/application/use-cases/auth/RefreshTokenUseCase';
import { Container } from '@/infrastructure/config/container';

export async function POST(request: NextRequest) {
  try {
    // Get refresh token from cookie
    const refreshToken = request.cookies.get('refreshToken')?.value;
    
    if (!refreshToken) {
      return NextResponse.json(
        { error: 'Refresh token not found' },
        { status: 401 }
      );
    }
    
    // Get use case from container
    const container = Container.getInstance();
    const refreshTokenUseCase = container.getRefreshTokenUseCase();
    
    // Execute use case
    const result = await refreshTokenUseCase.execute({ refreshToken });
    
    // Set tokens as HTTP-only cookies
    const response = NextResponse.json({
      user: result.user,
      accessToken: result.tokens.accessToken
    }, { status: 200 });

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
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}