import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';
import { uploadToS3 } from '@/infrastructure/storage/s3';

// 썸네일 설정
const THUMBNAIL_CONFIG = {
  maxWidth: 800,
  maxHeight: 600,
  quality: 85,
};

// POST /api/upload/thumbnail - 썸네일 이미지 업로드 (리사이징 후 S3)
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = formData.get('folder') as string || 'thumbnails';
    const postId = formData.get('postId') as string || 'new';
    const categoryId = formData.get('categoryId') as string || 'uncategorized';

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
        { error: '지원하지 않는 파일 형식입니다. (jpg, png, gif, webp만 가능)' },
        { status: 400 }
      );
    }

    // 파일 크기 검증 (원본 10MB)
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

    // 이미지 리사이징
    let resizedBuffer: Buffer;
    try {
      const image = sharp(buffer);
      const metadata = await image.metadata();

      // 이미지가 설정된 크기보다 작으면 원본 유지, 크면 리사이징
      if (metadata.width && metadata.height) {
        if (metadata.width > THUMBNAIL_CONFIG.maxWidth || metadata.height > THUMBNAIL_CONFIG.maxHeight) {
          resizedBuffer = await image
            .resize(THUMBNAIL_CONFIG.maxWidth, THUMBNAIL_CONFIG.maxHeight, {
              fit: 'inside',
              withoutEnlargement: true
            })
            .jpeg({ quality: THUMBNAIL_CONFIG.quality })
            .toBuffer();
        } else {
          // 원본 크기가 작으면 품질만 조정
          resizedBuffer = await image
            .jpeg({ quality: THUMBNAIL_CONFIG.quality })
            .toBuffer();
        }
      } else {
        // 메타데이터가 없으면 원본 사용
        resizedBuffer = buffer;
      }

      console.log(`Original size: ${(buffer.length / 1024).toFixed(2)}KB`);
      console.log(`Resized size: ${(resizedBuffer.length / 1024).toFixed(2)}KB`);
      console.log(`Size reduction: ${(100 - (resizedBuffer.length / buffer.length * 100)).toFixed(1)}%`);
    } catch (error) {
      console.error('Image resizing error:', error);
      // 리사이징 실패 시 원본 사용
      resizedBuffer = buffer;
    }

    // 파일명 생성 및 S3 키 생성 (.jpg 확장자로 통일)
    // 형식: posts-thumbnail_categoryId_postId_timestamp.jpg
    const timestamp = Date.now();
    const fileName = `posts-thumbnail_${categoryId}_${postId}_${timestamp}.jpg`;
    const key = `${folder}/${fileName}`;

    // S3 업로드
    const result = await uploadToS3(key, resizedBuffer, 'image/jpeg');

    // 기본 S3 URL 생성 (presigned URL이 아닌 짧은 URL)
    const baseUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

    return NextResponse.json({
      url: baseUrl,  // presigned URL 대신 기본 URL 반환
      key: result.key,
      fileName: file.name,
      originalSize: file.size,
      resizedSize: resizedBuffer.length,
      reduction: `${(100 - (resizedBuffer.length / file.size * 100)).toFixed(1)}%`
    }, { status: 201 });
  } catch (error) {
    console.error('Error uploading thumbnail:', error);
    return NextResponse.json(
      { error: '썸네일 업로드에 실패했습니다.' },
      { status: 500 }
    );
  }
}