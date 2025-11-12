import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import { S3Service } from '@/infrastructure/services/S3Service';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string; // 'business' or 'finance'
    const year = formData.get('year') as string;
    const reportId = formData.get('reportId') as string; // optional, for existing reports

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    if (!type || !['business', 'finance'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid type. Must be "business" or "finance"' },
        { status: 400 }
      );
    }

    if (!year) {
      return NextResponse.json(
        { error: 'Year is required' },
        { status: 400 }
      );
    }

    // Get file extension
    const fileExt = path.extname(file.name).toLowerCase();
    const allowedExtensions = [
      '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx',
      '.hwp', '.zip', '.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'
    ];

    if (!allowedExtensions.includes(fileExt)) {
      return NextResponse.json(
        { error: 'Invalid file type' },
        { status: 400 }
      );
    }

    // Initialize S3 service with 'reports' base path
    const s3Service = new S3Service('reports');

    // Generate directory path: type/year
    const directory = `${type}/${year}`;

    // Generate file key: timestamp_uniqueId_reportId.ext
    const timestamp = Date.now();
    const uniqueId = Math.random().toString(36).substring(2, 10);
    const reportIdSuffix = reportId ? `_${reportId}` : '_new';
    const fileKey = `${directory}/${timestamp}_${uniqueId}${reportIdSuffix}${fileExt}`;

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const fileType = file.type || 'application/octet-stream';

    // Upload to S3
    const uploadResult = await s3Service.uploadFile(
      fileKey,
      buffer,
      fileType,
      {
        originalName: file.name,
        reportType: type,
        reportYear: year,
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
