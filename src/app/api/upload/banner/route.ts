import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';
import { S3Service } from '@/infrastructure/services/S3Service';

// 배너 이미지 설정 (썸네일보다 더 큰 크기)
const BANNER_CONFIG = {
  maxWidth: 1920,
  maxHeight: 1080,
  quality: 90,
};

// POST /api/upload/banner - 메인 배너 이미지 업로드 (리사이징 후 S3)
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const bannerId = formData.get('bannerId') as string || 'new';

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
        if (metadata.width > BANNER_CONFIG.maxWidth || metadata.height > BANNER_CONFIG.maxHeight) {
          resizedBuffer = await image
            .resize(BANNER_CONFIG.maxWidth, BANNER_CONFIG.maxHeight, {
              fit: 'inside',
              withoutEnlargement: true
            })
            .jpeg({ quality: BANNER_CONFIG.quality })
            .toBuffer();
        } else {
          // 원본 크기가 작으면 품질만 조정
          resizedBuffer = await image
            .jpeg({ quality: BANNER_CONFIG.quality })
            .toBuffer();
        }
      } else {
        // 메타데이터가 없으면 원본 사용
        resizedBuffer = buffer;
      }

      console.log(`Banner Original size: ${(buffer.length / 1024).toFixed(2)}KB`);
      console.log(`Banner Resized size: ${(resizedBuffer.length / 1024).toFixed(2)}KB`);
      console.log(`Banner Size reduction: ${(100 - (resizedBuffer.length / buffer.length * 100)).toFixed(1)}%`);
    } catch (error) {
      console.error('Banner image resizing error:', error);
      // 리사이징 실패 시 원본 사용
      resizedBuffer = buffer;
    }

    // Initialize S3 service with 'main_banners' base path
    const s3Service = new S3Service('main_banners');

    // 파일명 생성 (.jpg 확장자로 통일)
    // 형식: banner_bannerId_timestamp.jpg
    const timestamp = Date.now();
    const fileName = `banner_${bannerId}_${timestamp}.jpg`;

    // S3 업로드 (basePath가 'main_banners'이므로 최종 경로: main_banners/파일명)
    const uploadResult = await s3Service.uploadImage(
      fileName,
      resizedBuffer,
      'image/jpeg',
      {
        originalName: file.name,
        uploadedAt: new Date().toISOString(),
        bannerId,
        type: 'main_banner'
      }
    );

    return NextResponse.json({
      url: uploadResult.url,
      key: uploadResult.key,
      fileName: file.name,
      originalSize: file.size,
      resizedSize: resizedBuffer.length,
      reduction: `${(100 - (resizedBuffer.length / file.size * 100)).toFixed(1)}%`,
      etag: uploadResult.etag
    }, { status: 201 });
  } catch (error) {
    console.error('Error uploading banner:', error);
    return NextResponse.json(
      { error: '배너 업로드에 실패했습니다.' },
      { status: 500 }
    );
  }
}
