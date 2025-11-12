'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { S3BannerUpload } from '@/presentation/components/common/S3BannerUpload';
import { imageOptionToTailwind, tailwindToImageOption, ImageOptionData } from '@/lib/utils/imageOptionConverter';

interface BannerFormData {
  title: string;
  subtitle: string;
  description: string;
  imagePath: string;
  imageOption: string;
  linkUrl: string;
  linkTarget: string;
  sortOrder: number;
  isActive: boolean;
  startDate: string;
  endDate: string;
}

export default function EditBannerPage() {
  const router = useRouter();
  const params = useParams();
  const bannerId = params.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<BannerFormData>({
    title: '',
    subtitle: '',
    description: '',
    imagePath: '',
    imageOption: '',
    linkUrl: '',
    linkTarget: '_self',
    sortOrder: 0,
    isActive: true,
    startDate: '',
    endDate: ''
  });

  // 이미지 옵션 상태 관리
  const [imageOptions, setImageOptions] = useState<ImageOptionData>({
    opacity: 100,
    backgroundType: 'none',
    solidColor: '#ffffff',
    gradientFrom: '#ffffff',
    gradientTo: '#000000',
    gradientDirection: 'to-b',
    gradientShape: 'linear',
  });

  useEffect(() => {
    fetchBanner();
  }, [bannerId]);

  const fetchBanner = async () => {
    try {
      const response = await fetch(`/api/admin/banners/${bannerId}`, {
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('배너를 불러올 수 없습니다.');
      }

      const banner = await response.json();

      // Convert dates to datetime-local format (YYYY-MM-DDTHH:mm)
      const formatDateForInput = (dateString: string | null) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
      };

      setFormData({
        title: banner.title || '',
        subtitle: banner.subtitle || '',
        description: banner.description || '',
        imagePath: banner.imagePath || '',
        imageOption: banner.imageOption || '',
        linkUrl: banner.linkUrl || '',
        linkTarget: banner.linkTarget || '_self',
        sortOrder: banner.sortOrder || 0,
        isActive: banner.isActive || false,
        startDate: formatDateForInput(banner.startDate),
        endDate: formatDateForInput(banner.endDate)
      });

      // Tailwind CSS 클래스를 이미지 옵션으로 변환
      if (banner.imageOption) {
        const parsedOptions = tailwindToImageOption(banner.imageOption);
        setImageOptions(parsedOptions);
      }
    } catch (error) {
      console.error('Error fetching banner:', error);
      alert('배너를 불러오는데 실패했습니다.');
      router.push('/admin/banners');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.imagePath.trim()) {
      alert('이미지를 업로드해주세요.');
      return;
    }

    setIsSubmitting(true);

    try {
      // 이미지 옵션을 Tailwind CSS로 변환
      const tailwindClasses = imageOptionToTailwind(imageOptions);
      const submitData = {
        ...formData,
        imageOption: tailwindClasses,
      };

      console.log('Submitting banner data:', submitData);

      const response = await fetch(`/api/admin/banners/${bannerId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(submitData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || '배너 수정에 실패했습니다.');
      }

      alert('배너가 성공적으로 수정되었습니다.');
      router.push('/admin/banners');
    } catch (error) {
      console.error('Error updating banner:', error);
      alert(error instanceof Error ? error.message : '배너 수정에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('정말로 이 배너를 삭제하시겠습니까?')) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/admin/banners/${bannerId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || '배너 삭제에 실패했습니다.');
      }

      alert('배너가 삭제되었습니다.');
      router.push('/admin/banners');
    } catch (error) {
      console.error('Error deleting banner:', error);
      alert(error instanceof Error ? error.message : '배너 삭제에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
        <div className="flex justify-center items-center min-h-screen">
          <p className="text-gray-500">로딩 중...</p>
        </div>
    );
  }

  return (
      <div className="max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link
              href="/admin/banners"
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <h1 className="text-2xl font-bold">배너 수정</h1>
          </div>

          {/* 삭제 버튼 */}
          <button
            type="button"
            onClick={handleDelete}
            disabled={isSubmitting}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
          >
            삭제
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* 기본 정보 */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium mb-4">기본 정보</h3>

              {/* 제목 */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  제목
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="배너 제목을 입력하세요"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isSubmitting}
                />
              </div>

              {/* 부제목 */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  부제목
                </label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) => setFormData(prev => ({ ...prev, subtitle: e.target.value }))}
                  placeholder="배너 부제목을 입력하세요"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isSubmitting}
                />
              </div>

              {/* 설명 */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  설명
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="배너 설명을 입력하세요"
                  rows={3}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* 이미지 */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium mb-4">배너 이미지 *</h3>

              {formData.imagePath && (
                <div className="relative mb-4">
                  <img
                    src={formData.imagePath}
                    alt="배너 미리보기"
                    className="w-full h-60 object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, imagePath: '' }))}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}

              <S3BannerUpload
                onUploadSuccess={(url) => setFormData(prev => ({ ...prev, imagePath: url }))}
                onUploadError={(error) => alert(error)}
                buttonText="배너 이미지 업로드"
                maxSize={10}
                bannerId={bannerId}
              />

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">또는</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL 직접 입력
                </label>
                <input
                  type="url"
                  value={formData.imagePath}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value.startsWith('data:')) {
                      alert('이미지 데이터를 직접 붙여넣을 수 없습니다. S3 업로드 버튼을 사용하거나 외부 URL을 입력하세요.');
                      return;
                    }
                    setFormData(prev => ({ ...prev, imagePath: value }));
                  }}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isSubmitting}
                />
              </div>

              {/* 이미지 옵션 */}
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-4">이미지 표시 옵션</h4>

                {/* 투명도 */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    이미지 투명도: {imageOptions.opacity}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={imageOptions.opacity}
                    onChange={(e) => setImageOptions(prev => ({ ...prev, opacity: parseInt(e.target.value) }))}
                    className="w-full"
                    disabled={isSubmitting}
                  />
                </div>

                {/* 여백 배경 */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    여백 배경
                  </label>
                  <select
                    value={imageOptions.backgroundType}
                    onChange={(e) => setImageOptions(prev => ({ ...prev, backgroundType: e.target.value as any }))}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isSubmitting}
                  >
                    <option value="none">없음</option>
                    <option value="solid">단색</option>
                    <option value="gradient">그라데이션</option>
                  </select>
                </div>

                {/* 단색 배경 */}
                {imageOptions.backgroundType === 'solid' && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      배경 색상
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={imageOptions.solidColor}
                        onChange={(e) => setImageOptions(prev => ({ ...prev, solidColor: e.target.value }))}
                        className="w-16 h-10 border rounded cursor-pointer"
                        disabled={isSubmitting}
                      />
                      <input
                        type="text"
                        value={imageOptions.solidColor}
                        onChange={(e) => setImageOptions(prev => ({ ...prev, solidColor: e.target.value }))}
                        placeholder="#ffffff"
                        className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                )}

                {/* 그라데이션 배경 */}
                {imageOptions.backgroundType === 'gradient' && (
                  <div className="space-y-4 mb-4">
                    {/* 그라데이션 도형 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        그라데이션 도형
                      </label>
                      <select
                        value={imageOptions.gradientShape}
                        onChange={(e) => setImageOptions(prev => ({ ...prev, gradientShape: e.target.value as any }))}
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={isSubmitting}
                      >
                        <option value="linear">선형 (Linear)</option>
                        <option value="radial">방사형 (Radial)</option>
                      </select>
                    </div>

                    {/* 그라데이션 방향 (선형일 때만) */}
                    {imageOptions.gradientShape === 'linear' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          그라데이션 방향
                        </label>
                        <select
                          value={imageOptions.gradientDirection}
                          onChange={(e) => setImageOptions(prev => ({ ...prev, gradientDirection: e.target.value as any }))}
                          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          disabled={isSubmitting}
                        >
                          <option value="to-t">위로 (↑)</option>
                          <option value="to-b">아래로 (↓)</option>
                          <option value="to-l">왼쪽으로 (←)</option>
                          <option value="to-r">오른쪽으로 (→)</option>
                          <option value="to-tl">왼쪽 위로 (↖)</option>
                          <option value="to-tr">오른쪽 위로 (↗)</option>
                          <option value="to-bl">왼쪽 아래로 (↙)</option>
                          <option value="to-br">오른쪽 아래로 (↘)</option>
                        </select>
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        시작 색상
                      </label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="color"
                          value={imageOptions.gradientFrom}
                          onChange={(e) => setImageOptions(prev => ({ ...prev, gradientFrom: e.target.value }))}
                          className="w-16 h-10 border rounded cursor-pointer"
                          disabled={isSubmitting}
                        />
                        <input
                          type="text"
                          value={imageOptions.gradientFrom}
                          onChange={(e) => setImageOptions(prev => ({ ...prev, gradientFrom: e.target.value }))}
                          placeholder="#ffffff"
                          className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        종료 색상
                      </label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="color"
                          value={imageOptions.gradientTo}
                          onChange={(e) => setImageOptions(prev => ({ ...prev, gradientTo: e.target.value }))}
                          className="w-16 h-10 border rounded cursor-pointer"
                          disabled={isSubmitting}
                        />
                        <input
                          type="text"
                          value={imageOptions.gradientTo}
                          onChange={(e) => setImageOptions(prev => ({ ...prev, gradientTo: e.target.value }))}
                          placeholder="#000000"
                          className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* 미리보기 */}
                <div className="mt-4 p-4 border rounded-md bg-gray-50">
                  <p className="text-xs text-gray-500 mb-2">생성될 Tailwind 클래스:</p>
                  <code className="text-xs bg-gray-800 text-white px-2 py-1 rounded">
                    {imageOptionToTailwind(imageOptions) || '(없음)'}
                  </code>
                </div>
              </div>
            </div>

            {/* 링크 설정 */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium mb-4">링크 설정</h3>

              {/* 링크 URL */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  링크 URL
                </label>
                <input
                  type="text"
                  value={formData.linkUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, linkUrl: e.target.value }))}
                  placeholder="https://example.com 또는 /about"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isSubmitting}
                />
                <p className="text-xs text-gray-500 mt-1">
                  외부 URL (https://...) 또는 내부 경로 (/about, /contact 등) 입력 가능
                </p>
              </div>

              {/* 링크 타겟 */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  링크 타겟
                </label>
                <select
                  value={formData.linkTarget}
                  onChange={(e) => setFormData(prev => ({ ...prev, linkTarget: e.target.value }))}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isSubmitting}
                >
                  <option value="_self">현재 창 (_self)</option>
                  <option value="_blank">새 창 (_blank)</option>
                </select>
              </div>
            </div>

            {/* 게시 설정 */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium mb-4">게시 설정</h3>

              {/* 정렬 순서 */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  정렬 순서
                </label>
                <input
                  type="number"
                  value={formData.sortOrder}
                  onChange={(e) => setFormData(prev => ({ ...prev, sortOrder: parseInt(e.target.value) || 0 }))}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isSubmitting}
                />
                <p className="text-xs text-gray-500 mt-1">숫자가 작을수록 먼저 표시됩니다.</p>
              </div>

              {/* 게시 기간 */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    시작일
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.startDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    종료일
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.endDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {/* 활성 상태 */}
              <div className="mb-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                    className="rounded border-gray-300"
                    disabled={isSubmitting}
                  />
                  <span className="text-sm font-medium text-gray-700">활성화</span>
                </label>
              </div>

              {/* 수정 버튼 */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {isSubmitting ? '처리 중...' : '배너 수정'}
              </button>
            </div>
          </div>
        </form>
      </div>
  );
}
