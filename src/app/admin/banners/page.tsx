'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { formatDate } from '@/lib/utils/date';

interface Banner {
  id: number;
  title: string;
  subtitle: string | null;
  description: string | null;
  image_path: string;
  link_url: string | null;
  link_target: string;
  sort_order: number;
  is_active: boolean;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
  updated_at: string;
}

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [selectedBanners, setSelectedBanners] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const response = await fetch('/api/admin/banners', {
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to fetch banners');

      const data = await response.json();
      setBanners(data);
    } catch (error) {
      console.error('Error fetching banners:', error);
      setBanners([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked && banners) {
      setSelectedBanners(banners.map(banner => banner.id));
    } else {
      setSelectedBanners([]);
    }
  };

  const handleSelectBanner = (bannerId: number) => {
    setSelectedBanners(prev =>
      prev.includes(bannerId)
        ? prev.filter(id => id !== bannerId)
        : [...prev, bannerId]
    );
  };

  const handleBulkDelete = async () => {
    if (selectedBanners.length === 0) return;

    if (!confirm(`선택한 ${selectedBanners.length}개의 배너를 삭제하시겠습니까?`)) {
      return;
    }

    try {
      const response = await fetch('/api/admin/banners', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ bannerIds: selectedBanners }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete banners');
      }

      alert('배너가 삭제되었습니다.');
      setSelectedBanners([]);
      fetchBanners();
    } catch (error) {
      console.error('Error deleting banners:', error);
      alert('배너 삭제에 실패했습니다.');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">메인 배너 관리</h1>
        <Link
          href="/admin/banners/new"
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/80"
        >
          새 배너 추가
        </Link>
      </div>
  
      {/* Bulk Actions */}
      {selectedBanners.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-blue-800">
              {selectedBanners.length}개 항목 선택됨
            </p>
            <div className="flex space-x-2">
              <button
                onClick={handleBulkDelete}
                className="px-4 py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-700"
              >
                선택 삭제
              </button>
              <button
                onClick={() => setSelectedBanners([])}
                className="px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-md hover:bg-gray-200"
              >
                선택 해제
              </button>
            </div>
          </div>
        </div>
      )}
  
      {/* Banners Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center">
            <p className="text-gray-500">로딩 중...</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={banners && banners.length > 0 && selectedBanners.length === banners.length}
                    className="rounded border-gray-300"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  미리보기
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  제목
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  순서
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  상태
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  게시 기간
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  작성일
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  관리
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {banners && banners.length > 0 ? (
                banners.map((banner) => (
                  <tr key={banner.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedBanners.includes(banner.id)}
                        onChange={() => handleSelectBanner(banner.id)}
                        className="rounded border-gray-300"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <img
                        src={banner.image_path}
                        alt={banner.title}
                        className="w-20 h-12 object-cover rounded"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/admin/banners/${banner.id}/edit`}
                        className="text-sm font-medium text-gray-900 hover:text-blue-600"
                      >
                        {banner.title}
                      </Link>
                      {banner.subtitle && (
                        <p className="text-xs text-gray-500 mt-1">{banner.subtitle}</p>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center text-sm text-gray-500">
                      {banner.sort_order}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${banner.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {banner.is_active ? '활성' : '비활성'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center text-xs text-gray-500">
                      {banner.start_date ? formatDate(banner.start_date) : '-'}
                      {' ~ '}
                      {banner.end_date ? formatDate(banner.end_date) : '-'}
                    </td>
                    <td className="px-6 py-4 text-center text-sm text-gray-500">
                      {formatDate(banner.created_at)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <Link
                          href={`/admin/banners/${banner.id}/edit`}
                          className="text-gray-400 hover:text-gray-600"
                          title="수정"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                    등록된 배너가 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
