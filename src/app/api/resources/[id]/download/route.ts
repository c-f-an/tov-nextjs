import { NextRequest, NextResponse } from 'next/server';
import { getContainer } from '@/infrastructure/config/getContainer';
import { S3Service } from '@/infrastructure/services/S3Service';

// GET /api/resources/[id]/download - Download resource file
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const resourceId = parseInt(params.id);

    if (isNaN(resourceId)) {
      return NextResponse.json(
        { error: 'Invalid resource ID' },
        { status: 400 }
      );
    }

    const container = getContainer();
    const resourceRepository = container.getResourceRepository();

    const resource = await resourceRepository.findById(resourceId);

    if (!resource) {
      return NextResponse.json(
        { error: 'Resource not found' },
        { status: 404 }
      );
    }

    // If external link, redirect
    if (resource.externalLink) {
      return NextResponse.redirect(resource.externalLink);
    }

    // Check if file exists
    if (!resource.filePath) {
      return NextResponse.json(
        { error: 'No file available for download' },
        { status: 404 }
      );
    }

    // Log download
    const ipAddress = request.headers.get('x-forwarded-for') ||
                     request.headers.get('x-real-ip') ||
                     'unknown';
    const userAgent = request.headers.get('user-agent') || null;

    // TODO: Get userId from authentication
    await resourceRepository.logDownload(resourceId, null, ipAddress, userAgent);
    await resourceRepository.incrementDownloadCount(resourceId);

    // Initialize S3 service
    const s3Service = new S3Service();

    try {
      // Check if file path is S3 key (starts with data-archive/)
      const isS3File = resource.filePath.includes('data-archive/') ||
                       resource.filePath.includes('resources/');

      if (isS3File) {
        // Generate presigned URL for S3 download
        const presignedUrl = await s3Service.getPresignedDownloadUrl(
          resource.filePath,
          3600 // 1 hour expiration
        );

        // Redirect to presigned URL
        return NextResponse.redirect(presignedUrl);
      } else {
        // For backward compatibility - try to get file from S3 directly
        try {
          const fileData = await s3Service.getFile(resource.filePath);

          // Set appropriate headers
          const headers = new Headers();
          headers.set('Content-Type', fileData.contentType || resource.fileType || 'application/octet-stream');
          headers.set('Content-Disposition', `attachment; filename="${resource.originalFilename || 'download'}"`);
          headers.set('Content-Length', fileData.contentLength?.toString() || resource.fileSize?.toString() || '0');
          headers.set('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour

          return new NextResponse(fileData.body, {
            status: 200,
            headers
          });
        } catch (s3Error) {
          console.error('S3 download error:', s3Error);

          // If file doesn't exist in S3, generate presigned URL anyway
          const presignedUrl = await s3Service.getPresignedDownloadUrl(
            resource.filePath,
            3600
          );

          return NextResponse.redirect(presignedUrl);
        }
      }
    } catch (error) {
      console.error('Error accessing file:', error);
      return NextResponse.json(
        { error: 'File not found or inaccessible' },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error('Error downloading resource:', error);
    return NextResponse.json(
      { error: 'Failed to download resource' },
      { status: 500 }
    );
  }
}