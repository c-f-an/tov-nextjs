import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
  ListObjectsV2Command
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export class S3Service {
  private s3Client: S3Client;
  private bucketName: string;
  private basePath: string;

  constructor(basePath: string = 'data-archive') {
    // Initialize S3 client with credentials from environment variables
    this.s3Client = new S3Client({
      region: process.env.AWS_REGION || 'ap-northeast-2',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
      }
    });

    this.bucketName = process.env.AWS_S3_BUCKET || 'tov-homepage-resource-production';
    this.basePath = basePath;
  }

  /**
   * Upload file to S3
   */
  async uploadFile(
    key: string,
    body: Buffer | Uint8Array | string,
    contentType: string,
    metadata?: Record<string, string>
  ): Promise<{
    key: string;
    url: string;
    etag?: string;
  }> {
    const fullKey = `${this.basePath}/${key}`;

    try {
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: fullKey,
        Body: body,
        ContentType: contentType,
        Metadata: metadata,
        ServerSideEncryption: 'AES256', // Enable server-side encryption
        StorageClass: 'STANDARD_IA' // Use Infrequent Access for cost optimization
      });

      const response = await this.s3Client.send(command);

      return {
        key: fullKey,
        url: this.getPublicUrl(fullKey),
        etag: response.ETag
      };
    } catch (error) {
      console.error('S3 upload error:', error);
      throw new Error(`Failed to upload file to S3: ${error}`);
    }
  }

  /**
   * Generate presigned URL for download
   */
  async getPresignedDownloadUrl(
    key: string,
    expiresIn: number = 3600 // 1 hour default
  ): Promise<string> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key.startsWith(this.basePath) ? key : `${this.basePath}/${key}`
      });

      const url = await getSignedUrl(this.s3Client, command, { expiresIn });
      return url;
    } catch (error) {
      console.error('S3 presigned URL error:', error);
      throw new Error(`Failed to generate presigned URL: ${error}`);
    }
  }

  /**
   * Generate presigned URL for download (using absolute key without basePath)
   */
  async getPresignedDownloadUrlAbsolute(
    key: string,
    expiresIn: number = 3600 // 1 hour default
  ): Promise<string> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key // Use key as-is without basePath
      });

      const url = await getSignedUrl(this.s3Client, command, { expiresIn });
      return url;
    } catch (error) {
      console.error('S3 presigned URL error:', error);
      throw new Error(`Failed to generate presigned URL: ${error}`);
    }
  }

  /**
   * Get file from S3
   */
  async getFile(key: string): Promise<{
    body: Uint8Array;
    contentType?: string;
    contentLength?: number;
    metadata?: Record<string, string>;
  }> {
    const fullKey = key.startsWith(this.basePath) ? key : `${this.basePath}/${key}`;

    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: fullKey
      });

      const response = await this.s3Client.send(command);

      // Convert stream to buffer
      const chunks: Uint8Array[] = [];
      const stream = response.Body as any;

      for await (const chunk of stream) {
        chunks.push(chunk);
      }

      const body = Buffer.concat(chunks);

      return {
        body,
        contentType: response.ContentType,
        contentLength: response.ContentLength,
        metadata: response.Metadata
      };
    } catch (error) {
      console.error('S3 get file error:', error);
      throw new Error(`Failed to get file from S3: ${error}`);
    }
  }

  /**
   * Delete file from S3
   */
  async deleteFile(key: string): Promise<void> {
    const fullKey = key.startsWith(this.basePath) ? key : `${this.basePath}/${key}`;

    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: fullKey
      });

      await this.s3Client.send(command);
    } catch (error) {
      console.error('S3 delete error:', error);
      throw new Error(`Failed to delete file from S3: ${error}`);
    }
  }

  /**
   * Check if file exists in S3
   */
  async fileExists(key: string): Promise<boolean> {
    const fullKey = key.startsWith(this.basePath) ? key : `${this.basePath}/${key}`;

    try {
      const command = new HeadObjectCommand({
        Bucket: this.bucketName,
        Key: fullKey
      });

      await this.s3Client.send(command);
      return true;
    } catch (error: any) {
      if (error.name === 'NotFound' || error.$metadata?.httpStatusCode === 404) {
        return false;
      }
      throw error;
    }
  }

  /**
   * List files in a directory
   */
  async listFiles(prefix: string = '', maxKeys: number = 1000): Promise<{
    files: Array<{
      key: string;
      size: number;
      lastModified: Date;
    }>;
    isTruncated: boolean;
  }> {
    const fullPrefix = `${this.basePath}/${prefix}`;

    try {
      const command = new ListObjectsV2Command({
        Bucket: this.bucketName,
        Prefix: fullPrefix,
        MaxKeys: maxKeys
      });

      const response = await this.s3Client.send(command);

      const files = (response.Contents || []).map(item => ({
        key: item.Key || '',
        size: item.Size || 0,
        lastModified: item.LastModified || new Date()
      }));

      return {
        files,
        isTruncated: response.IsTruncated || false
      };
    } catch (error) {
      console.error('S3 list files error:', error);
      throw new Error(`Failed to list files from S3: ${error}`);
    }
  }

  /**
   * Generate public URL for file (if bucket is public)
   */
  getPublicUrl(key: string): string {
    const fullKey = key.startsWith(this.basePath) ? key : `${this.basePath}/${key}`;
    const region = process.env.AWS_REGION || 'ap-northeast-2';

    // CloudFront URL if configured
    if (process.env.AWS_CLOUDFRONT_URL) {
      return `${process.env.AWS_CLOUDFRONT_URL}/${fullKey}`;
    }

    // Direct S3 URL
    return `https://${this.bucketName}.s3.${region}.amazonaws.com/${fullKey}`;
  }

  /**
   * Generate a unique file key with timestamp
   */
  generateFileKey(filename: string, directory: string = ''): string {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    const safeName = filename.replace(/[^a-zA-Z0-9.-]/g, '_');

    const key = directory
      ? `${directory}/${timestamp}_${randomString}_${safeName}`
      : `${timestamp}_${randomString}_${safeName}`;

    return key;
  }

  /**
   * Upload image file with resizing (for thumbnails)
   */
  async uploadImage(
    key: string,
    body: Buffer,
    contentType: string = 'image/jpeg',
    metadata?: Record<string, string>
  ): Promise<{
    key: string;
    url: string;
    etag?: string;
  }> {
    return this.uploadFile(key, body, contentType, metadata);
  }

  /**
   * Get base path for the S3 service instance
   */
  getBasePath(): string {
    return this.basePath;
  }
}