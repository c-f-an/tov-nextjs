'use client';

import React, { useState } from 'react';

interface S3ImageUploadProps {
  onUploadSuccess: (url: string) => void;
  onUploadError?: (error: string) => void;
  folder?: string;
  buttonText?: string;
  accept?: string;
  maxSize?: number; // MB 단위
}

export const S3ImageUpload: React.FC<S3ImageUploadProps> = ({
  onUploadSuccess,
  onUploadError,
  folder = 'uploads',
  buttonText = '이미지 업로드',
  accept = 'image/*',
  maxSize = 10,
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

    setIsUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '업로드 실패');
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
          {isUploading ? '업로드 중...' : buttonText}
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
    </div>
  );
};