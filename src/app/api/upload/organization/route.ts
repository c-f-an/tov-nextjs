import { NextRequest, NextResponse } from 'next/server';
import { S3Service } from '@/infrastructure/services/S3Service';
import sharp from 'sharp';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const personId = formData.get('personId') as string || 'new';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // 파일 크기 제한 (10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size exceeds 10MB limit' }, { status: 400 });
    }

    // 이미지 타입 확인
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Only image files are allowed' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // 이미지 리사이징 (300x300, webp 변환)
    let resizedBuffer: Buffer;
    try {
      resizedBuffer = await sharp(buffer)
        .resize(300, 300, {
          fit: 'cover',
          position: 'center'
        })
        .webp({ quality: 85 })
        .toBuffer();

      console.log(`Original size: ${(buffer.length / 1024).toFixed(2)}KB`);
      console.log(`Resized size: ${(resizedBuffer.length / 1024).toFixed(2)}KB`);
    } catch (error) {
      console.error('Image resizing error:', error);
      resizedBuffer = buffer;
    }

    // S3 서비스 초기화 (organization 폴더)
    const s3Service = new S3Service('organization');

    // 파일명 생성
    const timestamp = Date.now();
    const fileName = `thumbnail_${personId}_${timestamp}.webp`;

    // S3 업로드
    const uploadResult = await s3Service.uploadImage(
      fileName,
      resizedBuffer,
      'image/webp',
      {
        originalName: encodeURIComponent(file.name),
        uploadedAt: new Date().toISOString(),
        personId
      }
    );

    return NextResponse.json({
      url: uploadResult.url,
      key: uploadResult.key,
      fileName: file.name
    });

  } catch (error) {
    console.error('Error uploading organization photo:', error);
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    );
  }
}
