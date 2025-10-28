'use client';

import React, { useState } from 'react';

interface S3BannerUploadProps {
  onUploadSuccess: (url: string) => void;
  onUploadError?: (error: string) => void;
  buttonText?: string;
  accept?: string;
  maxSize?: number; // MB 단위
  bannerId?: string;
}

export const S3BannerUpload: React.FC<S3BannerUploadProps> = ({
  onUploadSuccess,
  onUploadError,
  buttonText = '배너 이미지 업로드',
  accept = 'image/*',
  maxSize = 10,
  bannerId = 'new',
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // 파일 크기 검증
    if (file.size > maxSize * 1024 * 1024) {
      onUploadError?.(`파일 크기는 ${maxSize}MB를 초과할 수 없습니다.`);
      return;
    }

    // 이미지 파일 타입 검증
    if (!file.type.startsWith('image/')) {
      onUploadError?.('이미지 파일만 업로드 가능합니다.');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('bannerId', bannerId);

    try {
      // 배너 전용 엔드포인트로 요청
      const response = await fetch('/api/upload/banner', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '업로드 실패');
      }

      // 리사이징 정보 로그 (개발용)
      if (data.reduction) {
        console.log(`배너 크기 감소: ${data.reduction}`);
        console.log(`원본: ${(data.originalSize / 1024).toFixed(2)}KB → 리사이즈: ${(data.resizedSize / 1024).toFixed(2)}KB`);
      }

      onUploadSuccess(data.url);
      setUploadProgress(100);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '업로드 중 오류가 발생했습니다.';
      onUploadError?.(errorMessage);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      // 같은 파일 재선택 가능하도록 input 초기화
      e.target.value = '';
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="relative inline-block">
        <input
          type="file"
          accept={accept}
          onChange={handleFileChange}
          disabled={isUploading}
          className="sr-only"
        />
        <span
          className={`
            px-4 py-2 rounded-lg font-medium cursor-pointer inline-block
            ${isUploading
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : 'bg-blue-500 text-white hover:bg-blue-600'
            }
          `}
        >
          {isUploading ? '업로드 및 최적화 중...' : buttonText}
        </span>
      </label>

      {isUploading && (
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${uploadProgress}%` }}
          ></div>
        </div>
      )}

      <p className="text-xs text-gray-500">
        이미지는 자동으로 1920x1080px 이하로 최적화됩니다.
      </p>
    </div>
  );
};
