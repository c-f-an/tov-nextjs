import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// S3 클라이언트 초기화
const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME!;

/**
 * S3에 파일 업로드
 * @param key - S3에 저장될 파일 경로 (예: 'posts/thumbnails/image.jpg')
 * @param body - 파일 버퍼
 * @param contentType - 파일 타입 (예: 'image/jpeg')
 */
export async function uploadToS3(
  key: string,
  body: Buffer,
  contentType: string
): Promise<{ key: string; presignedUrl?: string }> {
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: body,
    ContentType: contentType,
  });

  await s3Client.send(command);

  // 프라이빗 버킷인 경우 pre-signed URL 생성
  // 퍼블릭 버킷인 경우 직접 URL 반환
  if (process.env.S3_BUCKET_IS_PUBLIC === 'true') {
    return {
      key,
      presignedUrl: `${process.env.NEXT_PUBLIC_S3_BUCKET_URL}/${key}`
    };
  }

  // 프라이빗 버킷: pre-signed URL 생성 (1시간 유효)
  const presignedUrl = await getPresignedUrl(key, 3600);
  return { key, presignedUrl };
}

/**
 * S3에서 파일 삭제
 * @param key - 삭제할 파일 경로
 */
export async function deleteFromS3(key: string): Promise<void> {
  const command = new DeleteObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });

  await s3Client.send(command);
}

/**
 * Pre-signed URL 생성 (클라이언트 직접 업로드용)
 * @param key - S3에 저장될 파일 경로
 * @param contentType - 파일 타입
 * @param expiresIn - URL 만료 시간(초)
 */
export async function generatePresignedUrl(
  key: string,
  contentType: string,
  expiresIn: number = 3600
): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    ContentType: contentType,
  });

  return await getSignedUrl(s3Client, command, { expiresIn });
}

/**
 * 파일 확장자에서 MIME 타입 추출
 */
export function getMimeType(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase();

  const mimeTypes: Record<string, string> = {
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'gif': 'image/gif',
    'webp': 'image/webp',
    'svg': 'image/svg+xml',
    'pdf': 'application/pdf',
  };

  return mimeTypes[ext || ''] || 'application/octet-stream';
}

/**
 * 파일명 생성 (타임스탬프 + 랜덤 문자열)
 */
export function generateFileName(originalName: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 9);
  const ext = originalName.split('.').pop();
  return `${timestamp}-${random}.${ext}`;
}

/**
 * Pre-signed URL 생성 (읽기용)
 * @param key - S3 파일 경로
 * @param expiresIn - URL 만료 시간(초)
 */
export async function getPresignedUrl(
  key: string,
  expiresIn: number = 3600
): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });

  return await getSignedUrl(s3Client, command, { expiresIn });
}