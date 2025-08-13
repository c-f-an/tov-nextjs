import { writeFile, mkdir, unlink } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import crypto from 'crypto';
import sharp from 'sharp';

export interface UploadOptions {
  allowedMimeTypes?: string[];
  maxFileSize?: number;
  generateThumbnail?: boolean;
  thumbnailSize?: { width: number; height: number };
}

export interface UploadResult {
  filename: string;
  originalFilename: string;
  path: string;
  mimeType: string;
  size: number;
  thumbnailPath?: string;
}

export class FileUploadService {
  private readonly uploadDir: string;
  private readonly publicPath: string;

  constructor() {
    this.uploadDir = path.join(process.cwd(), 'public', 'uploads');
    this.publicPath = '/uploads';
  }

  async uploadFile(
    file: File,
    subDirectory: string = '',
    options: UploadOptions = {}
  ): Promise<UploadResult> {
    // Validate file
    this.validateFile(file, options);

    // Create upload directory if it doesn't exist
    const fullUploadDir = path.join(this.uploadDir, subDirectory);
    if (!existsSync(fullUploadDir)) {
      await mkdir(fullUploadDir, { recursive: true });
    }

    // Generate unique filename
    const fileExt = path.extname(file.name);
    const uniqueFilename = `${crypto.randomBytes(16).toString('hex')}${fileExt}`;
    const filePath = path.join(fullUploadDir, uniqueFilename);
    const publicPath = path.join(this.publicPath, subDirectory, uniqueFilename);

    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Write file
    await writeFile(filePath, buffer);

    const result: UploadResult = {
      filename: uniqueFilename,
      originalFilename: file.name,
      path: publicPath,
      mimeType: file.type,
      size: file.size
    };

    // Generate thumbnail if requested and file is an image
    if (options.generateThumbnail && this.isImage(file.type)) {
      const thumbnailFilename = `thumb_${uniqueFilename}`;
      const thumbnailPath = path.join(fullUploadDir, thumbnailFilename);
      const thumbnailPublicPath = path.join(this.publicPath, subDirectory, thumbnailFilename);

      const thumbnailSize = options.thumbnailSize || { width: 200, height: 200 };
      
      await sharp(buffer)
        .resize(thumbnailSize.width, thumbnailSize.height, {
          fit: 'cover',
          position: 'centre'
        })
        .toFile(thumbnailPath);

      result.thumbnailPath = thumbnailPublicPath;
    }

    return result;
  }

  async deleteFile(filePath: string): Promise<void> {
    const fullPath = path.join(process.cwd(), 'public', filePath);
    if (existsSync(fullPath)) {
      await unlink(fullPath);
    }
  }

  private validateFile(file: File, options: UploadOptions): void {
    // Check file size
    const maxSize = options.maxFileSize || 10 * 1024 * 1024; // 10MB default
    if (file.size > maxSize) {
      throw new Error(`File size exceeds maximum allowed size of ${maxSize} bytes`);
    }

    // Check mime type
    if (options.allowedMimeTypes && options.allowedMimeTypes.length > 0) {
      if (!options.allowedMimeTypes.includes(file.type)) {
        throw new Error(`File type ${file.type} is not allowed`);
      }
    }
  }

  private isImage(mimeType: string): boolean {
    return mimeType.startsWith('image/');
  }

  getImageMimeTypes(): string[] {
    return [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp',
      'image/svg+xml'
    ];
  }

  getDocumentMimeTypes(): string[] {
    return [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'text/plain'
    ];
  }
}