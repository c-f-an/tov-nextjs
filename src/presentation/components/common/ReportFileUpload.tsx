'use client';

import React, { useState } from 'react';

interface ReportFileUploadProps {
  onUploadSuccess: (url: string) => void;
  onUploadError?: (error: string) => void;
  type: 'business' | 'finance';
  year: string;
  reportId?: number; // optional, for existing reports
  buttonText?: string;
  maxSize?: number; // MB 단위
}

export const ReportFileUpload: React.FC<ReportFileUploadProps> = ({
  onUploadSuccess,
  onUploadError,
  type,
  year,
  reportId,
  buttonText = '파일 업로드',
  maxSize = 50,
}) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // 파일 크기 검증
    if (file.size > maxSize * 1024 * 1024) {
      onUploadError?.(`파일 크기는 ${maxSize}MB를 초과할 수 없습니다.`);
      return;
    }

    setIsUploading(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    formData.append('year', year);
    if (reportId) {
      formData.append('reportId', reportId.toString());
    }

    try {
      const response = await fetch('/api/upload/report', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '업로드 실패');
      }

      onUploadSuccess(data.url);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '업로드 중 오류가 발생했습니다.';
      onUploadError?.(errorMessage);
    } finally {
      setIsUploading(false);
      // 같은 파일 재선택 가능하도록 input 초기화
      e.target.value = '';
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="relative inline-block">
        <input
          type="file"
          accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.hwp,.zip,.jpg,.jpeg,.png,.gif,.webp,.svg"
          onChange={handleFileChange}
          disabled={isUploading}
          className="sr-only"
        />
        <span
          className={`
            px-4 py-2 rounded-lg font-medium cursor-pointer inline-block
            ${isUploading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
            }
            transition-colors duration-200
          `}
        >
          {isUploading ? '업로드 중...' : buttonText}
        </span>
      </label>
    </div>
  );
};
