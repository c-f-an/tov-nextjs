'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface S3ImageProps {
  s3Key?: string;
  publicUrl?: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
}

/**
 * S3 이미지 컴포넌트
 * - 프라이빗 버킷: s3Key를 사용하여 pre-signed URL 자동 생성
 * - 퍼블릭 버킷: publicUrl 직접 사용
 */
export const S3Image: React.FC<S3ImageProps> = ({
  s3Key,
  publicUrl,
  alt,
  width = 500,
  height = 300,
  className = '',
  priority = false,
}) => {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 퍼블릭 URL이 제공된 경우 직접 사용
    if (publicUrl) {
      setImageUrl(publicUrl);
      return;
    }

    // S3 Key가 제공된 경우 pre-signed URL 생성
    if (s3Key) {
      fetchPresignedUrl();
    }
  }, [s3Key, publicUrl]);

  const fetchPresignedUrl = async () => {
    if (!s3Key) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/upload/presigned-url?key=${encodeURIComponent(s3Key)}`);

      if (!response.ok) {
        throw new Error('Failed to get pre-signed URL');
      }

      const data = await response.json();
      setImageUrl(data.url);
    } catch (err) {
      console.error('Error fetching pre-signed URL:', err);
      setError('이미지를 불러올 수 없습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  if (error) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 ${className}`}
           style={{ width, height }}>
        <span className="text-gray-500 text-sm">{error}</span>
      </div>
    );
  }

  if (isLoading || !imageUrl) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 animate-pulse ${className}`}
           style={{ width, height }}>
        <span className="text-gray-400">Loading...</span>
      </div>
    );
  }

  return (
    <Image
      src={imageUrl}
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority={priority}
      onError={() => setError('이미지 로드 실패')}
    />
  );
};