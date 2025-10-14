import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import { S3Service } from '@/infrastructure/services/S3Service';

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
      'application/x-zip-compressed'
    ];

    const fileType = file.type || 'application/octet-stream';

    // Get file extension
    const fileExt = path.extname(file.name).toLowerCase();
    const allowedExtensions = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.hwp', '.zip'];

    if (!allowedExtensions.includes(fileExt)) {
      return NextResponse.json(
        { error: 'Invalid file type' },
        { status: 400 }
      );
    }

    // Initialize S3 service with 'data-archive' base path
    const s3Service = new S3Service('data-archive');

    // Generate unique key for S3 (year/month subdirectory for organization)
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    const directory = `${year}/${month}`;
    const fileKey = s3Service.generateFileKey(file.name, directory);

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to S3
    const uploadResult = await s3Service.uploadFile(
      fileKey,
      buffer,
      fileType,
      {
        originalName: file.name,
        uploadedAt: new Date().toISOString()
      }
    );

    return NextResponse.json({
      path: uploadResult.key, // S3 key
      url: uploadResult.url, // Public URL or CloudFront URL
      originalName: file.name,
      type: fileExt.substring(1).toUpperCase(),
      size: file.size,
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