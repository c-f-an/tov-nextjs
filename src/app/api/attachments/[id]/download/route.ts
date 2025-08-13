import { NextRequest, NextResponse } from 'next/server';
import { container } from '@/infrastructure/config/container.tsyringe';
import { IAttachmentRepository } from '@/core/domain/repositories/IAttachmentRepository';
import { readFile } from 'fs/promises';
import path from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const attachmentId = parseInt(params.id);
    
    if (isNaN(attachmentId)) {
      return NextResponse.json(
        { error: 'Invalid attachment ID' },
        { status: 400 }
      );
    }

    const attachmentRepository = container.resolve<IAttachmentRepository>('IAttachmentRepository');
    const attachment = await attachmentRepository.findById(attachmentId);

    if (!attachment) {
      return NextResponse.json(
        { error: 'Attachment not found' },
        { status: 404 }
      );
    }

    // Increment download count
    attachment.incrementDownloadCount();
    await attachmentRepository.update(attachment);

    // Read file
    const filePath = path.join(process.cwd(), 'public', attachment.path);
    const fileBuffer = await readFile(filePath);

    // Set appropriate headers
    const headers = new Headers();
    headers.set('Content-Type', attachment.mimeType || 'application/octet-stream');
    headers.set('Content-Disposition', `attachment; filename="${attachment.originalFilename}"`);
    headers.set('Content-Length', attachment.size?.toString() || '0');

    return new NextResponse(fileBuffer, {
      status: 200,
      headers
    });
  } catch (error) {
    console.error('Error downloading attachment:', error);
    return NextResponse.json(
      { error: 'Failed to download attachment' },
      { status: 500 }
    );
  }
}