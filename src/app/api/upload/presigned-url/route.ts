import { NextRequest, NextResponse } from 'next/server';
import { getPresignedUrl } from '@/infrastructure/storage/s3';

// GET /api/upload/presigned-url - Get pre-signed URL for existing S3 object
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const key = searchParams.get('key');

    if (!key) {
      return NextResponse.json(
        { error: 'S3 key is required' },
        { status: 400 }
      );
    }

    // Generate pre-signed URL (valid for 1 hour)
    const presignedUrl = await getPresignedUrl(key, 3600);

    return NextResponse.json({
      url: presignedUrl,
      key,
      expiresIn: 3600
    });
  } catch (error) {
    console.error('Error generating pre-signed URL:', error);
    return NextResponse.json(
      { error: 'Failed to generate pre-signed URL' },
      { status: 500 }
    );
  }
}