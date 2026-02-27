import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import sharp from 'sharp';
import { S3Service } from '@/infrastructure/services/S3Service';

// 이미지 업로드 설정
const IMAGE_CONFIG = {
  maxWidth: 1920,
  maxHeight: 1080,
  quality: 85,
};

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedMimeTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/x-hwp',
      'application/haansoft-hwp',
      'application/zip',
      'application/x-zip-compressed',
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp',
      'image/svg+xml'
    ];

    const fileType = file.type || 'application/octet-stream';

    // Get file extension
    const fileExt = path.extname(file.name).toLowerCase();
    const allowedExtensions = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.hwp', '.zip', '.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];

    if (!allowedExtensions.includes(fileExt)) {
      return NextResponse.json(
        { error: 'Invalid file type' },
        { status: 400 }
      );
    }

    // Initialize S3 service with 'data-archive' base path
    const s3Service = new S3Service('resources');

    // Generate unique key for S3 (year/month subdirectory for organization)
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    const directory = `${year}/${month}`;

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 이미지 파일인 경우 WebP로 변환
    const imageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const isImage = imageTypes.includes(fileType);

    let uploadBuffer: Buffer = buffer;
    let uploadContentType = fileType;
    let finalFileName = file.name;

    if (isImage) {
      try {
        const image = sharp(buffer);
        const metadata = await image.metadata();

        if (metadata.width && metadata.height) {
          if (metadata.width > IMAGE_CONFIG.maxWidth || metadata.height > IMAGE_CONFIG.maxHeight) {
            uploadBuffer = await image
              .resize(IMAGE_CONFIG.maxWidth, IMAGE_CONFIG.maxHeight, {
                fit: 'inside',
                withoutEnlargement: true
              })
              .webp({ quality: IMAGE_CONFIG.quality })
              .toBuffer();
          } else {
            uploadBuffer = await image
              .webp({ quality: IMAGE_CONFIG.quality })
              .toBuffer();
          }
        } else {
          uploadBuffer = await image
            .webp({ quality: IMAGE_CONFIG.quality })
            .toBuffer();
        }

        uploadContentType = 'image/webp';
        // 파일명 확장자를 webp로 변경
        const baseName = path.basename(file.name, path.extname(file.name));
        finalFileName = `${baseName}.webp`;

        console.log(`Image Original size: ${(buffer.length / 1024).toFixed(2)}KB`);
        console.log(`Image WebP size: ${(uploadBuffer.length / 1024).toFixed(2)}KB`);
        console.log(`Size reduction: ${(100 - (uploadBuffer.length / buffer.length * 100)).toFixed(1)}%`);
      } catch (error) {
        console.error('Image conversion error:', error);
        // 변환 실패 시 원본 사용
        uploadBuffer = buffer;
        uploadContentType = fileType;
        finalFileName = file.name;
      }
    }

    const fileKey = s3Service.generateFileKey(finalFileName, directory);

    // Upload to S3
    const uploadResult = await s3Service.uploadFile(
      fileKey,
      uploadBuffer,
      uploadContentType,
      {
        originalName: encodeURIComponent(file.name),
        uploadedAt: new Date().toISOString()
      }
    );

    return NextResponse.json({
      path: uploadResult.key, // S3 key
      url: uploadResult.url, // Public URL or CloudFront URL
      originalName: file.name,
      type: isImage ? 'WEBP' : fileExt.substring(1).toUpperCase(),
      size: file.size,
      convertedSize: uploadBuffer.length,
      fileName: fileKey,
      etag: uploadResult.etag
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to upload file' },
      { status: 500 }
    );
  }
}