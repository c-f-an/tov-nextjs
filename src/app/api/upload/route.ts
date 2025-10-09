import { NextRequest, NextResponse } from 'next/server';
import { uploadToS3, generateFileName, getMimeType } from '@/infrastructure/storage/s3';

// POST /api/upload - 이미지 업로드 (S3)
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = formData.get('folder') as string || 'uploads';

    if (!file) {
      return NextResponse.json(
        { error: '파일이 제공되지 않았습니다.' },
        { status: 400 }
      );
    }

    // 파일 타입 검증
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: '지원하지 않는 파일 형식입니다.' },
        { status: 400 }
      );
    }

    // 파일 크기 검증 (10MB로 증가)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: '파일 크기는 10MB를 초과할 수 없습니다.' },
        { status: 400 }
      );
    }

    // 파일을 버퍼로 변환
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 파일명 생성 및 S3 키 생성
    const fileName = generateFileName(file.name);
    const key = `${folder}/${fileName}`;

    // S3 업로드
    const result = await uploadToS3(key, buffer, file.type || getMimeType(file.name));

    return NextResponse.json({
      url: result.presignedUrl,
      key: result.key,
      fileName: file.name,
      size: file.size
    }, { status: 201 });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: '파일 업로드에 실패했습니다.' },
      { status: 500 }
    );
  }
}