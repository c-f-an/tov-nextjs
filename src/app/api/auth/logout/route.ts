import { NextRequest, NextResponse } from 'next/server';
import { LogoutUseCase } from '@/core/application/use-cases/auth/LogoutUseCase';
import { Container } from '@/infrastructure/config/container';

export async function POST(request: NextRequest) {
  try {
    // Get refresh token from cookie
    const refreshToken = request.cookies.get('refreshToken')?.value;
    
    if (refreshToken) {
      // Get use case from container
      const container = Container.getInstance();
      const logoutUseCase = container.getLogoutUseCase();
      
      // Execute use case
      await logoutUseCase.execute(refreshToken, 'User logout');
    }
    
    // Clear cookies
    const response = NextResponse.json({
      message: 'Logged out successfully'
    }, { status: 200 });

    // Clear access token cookie
    response.cookies.set('accessToken', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0, // Expire immediately
      path: '/'
    });

    // Clear refresh token cookie
    response.cookies.set('refreshToken', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0, // Expire immediately
      path: '/'
    });
    
    return response;
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}