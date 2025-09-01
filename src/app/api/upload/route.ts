import { getContainer } from '@/infrastructure/config/getContainer';
import { NextRequest, NextResponse } from 'next/server';

import { IAuthService } from '@/core/domain/services/IAuthService';
import { FileUploadService } from '@/infrastructure/services/FileUploadService';
import { IAttachmentRepository } from '@/core/domain/repositories/IAttachmentRepository';
import { Attachment } from '@/core/domain/entities/Attachment';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const container = getContainer();
    const authService = container.getAuthService();
    const payload = await authService.verifyAccessToken(token);

    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Parse form data
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const attachableType = formData.get('attachableType') as string;
    const attachableId = formData.get('attachableId') as string;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Determine upload options based on file type
    const fileUploadService = container.getFileUploadService();
    const isImage = file.type.startsWith('image/');
    
    const uploadOptions = {
      allowedMimeTypes: [
        ...fileUploadService.getImageMimeTypes(),
        ...fileUploadService.getDocumentMimeTypes()
      ],
      maxFileSize: 10 * 1024 * 1024, // 10MB
      generateThumbnail: isImage,
      thumbnailSize: { width: 300, height: 300 }
    };

    // Upload file
    const uploadResult = await fileUploadService.uploadFile(
      file,
      attachableType || 'general',
      uploadOptions
    );

    // Save attachment record if attachable info provided
    let attachment = null;
    if (attachableType && attachableId) {
      const attachmentRepository = container.getAttachmentRepository();
      
      const newAttachment = Attachment.create({
        attachableType,
        attachableId: parseInt(attachableId),
        filename: uploadResult.filename,
        originalFilename: uploadResult.originalFilename,
        path: uploadResult.path,
        mimeType: uploadResult.mimeType,
        size: BigInt(uploadResult.size)
      });

      attachment = await attachmentRepository.save(newAttachment);
    }

    return NextResponse.json({
      success: true,
      file: {
        filename: uploadResult.filename,
        originalFilename: uploadResult.originalFilename,
        path: uploadResult.path,
        thumbnailPath: uploadResult.thumbnailPath,
        mimeType: uploadResult.mimeType,
        size: uploadResult.size
      },
      attachment: attachment ? {
        id: attachment.id,
        attachableType: attachment.attachableType,
        attachableId: attachment.attachableId
      } : null
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to upload file' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Check authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const authService = container.getAuthService();
    const payload = await authService.verifyAccessToken(token);

    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const attachmentId = searchParams.get('id');
    const filePath = searchParams.get('path');

    if (!attachmentId && !filePath) {
      return NextResponse.json(
        { error: 'Either attachment ID or file path must be provided' },
        { status: 400 }
      );
    }

    const fileUploadService = container.getFileUploadService();

    // If attachment ID provided, delete from database and file system
    if (attachmentId) {
      const attachmentRepository = container.getAttachmentRepository();
      const attachment = await attachmentRepository.findById(parseInt(attachmentId));
      
      if (!attachment) {
        return NextResponse.json(
          { error: 'Attachment not found' },
          { status: 404 }
        );
      }

      // Delete file
      await fileUploadService.deleteFile(attachment.path);
      
      // Delete database record
      await attachmentRepository.delete(attachment.id);
      
      return NextResponse.json({ success: true, message: 'Attachment deleted' });
    }

    // If only file path provided, just delete the file
    if (filePath) {
      await fileUploadService.deleteFile(filePath);
      return NextResponse.json({ success: true, message: 'File deleted' });
    }
  } catch (error) {
    console.error('Error deleting file:', error);
    return NextResponse.json(
      { error: 'Failed to delete file' },
      { status: 500 }
    );
  }
}