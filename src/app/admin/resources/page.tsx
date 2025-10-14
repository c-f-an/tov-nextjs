'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { AdminLayout } from '@/presentation/components/admin/AdminLayout';
import { useAuth } from '@/presentation/contexts/AuthContext';
import Link from 'next/link';

interface Resource {
  id: number;
  categoryId: number;
  title: string;
  description: string | null;
  resourceType: string;
  fileType: string | null;
  originalFilename: string | null;
  fileSize: number | null;
  downloadCount: number;
  viewCount: number;
  isFeatured: boolean;
  isActive: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  category?: {
    id: number;
    name: string;
    slug: string;
  };
}

interface ResourceCategory {
  id: number;
  name: string;
  slug: string;
}

export default function AdminResourcesPage() {
  const router = useRouter();
  const { user, accessToken, loading: authLoading } = useAuth();
  const [resources, setResources] = useState<Resource[]>([]);
  const [categories, setCategories] = useState<ResourceCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchCategories = useCallback(async () => {
    try {
      const response = await fetch('/api/resources/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  }, []);

  const fetchResources = useCallback(async () => {
    if (!accessToken) return;

    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...(selectedCategory && { categoryId: selectedCategory }),
        ...(searchTerm && { search: searchTerm })
      });

      const response = await fetch(`/api/resources?${params}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        console.log('Fetched resources:', data); // Debug log
        setResources(data.items || []);
        setTotalPages(data.totalPages || 1);
      } else {
        console.error('Failed to fetch resources, status:', response.status);
        const errorData = await response.text();
        console.error('Error response:', errorData);
      }
    } catch (error) {
      console.error('Failed to fetch resources:', error);
    } finally {
      setLoading(false);
    }
  }, [accessToken, page, selectedCategory, searchTerm]);

  // 인증 확인 및 초기 로드
  useEffect(() => {
    // 인증 로딩 중이면 대기
    if (authLoading) {
      return;
    }

    // 인증 로딩이 완료되었고, user가 없거나 ADMIN이 아니면 리다이렉트
    if (!user || user.role !== 'ADMIN') {
      router.push('/login?redirect=/admin/resources');
      return;
    }

    // ADMIN 권한이 확인되면 카테고리만 로드 (최초 1회)
    fetchCategories();
  }, [user, authLoading, router, fetchCategories]);

  // 리소스 데이터 로드 (페이지, 카테고리, 검색어 변경 시)
  useEffect(() => {
    if (!authLoading && user && user.role === 'ADMIN') {
      fetchResources();
    }
  }, [authLoading, user, fetchResources]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchResources();
  };

  const handleDelete = async (id: number) => {
    if (!confirm('정말 이 자료를 삭제하시겠습니까?')) return;

    try {
      const response = await fetch(`/api/resources/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (response.ok) {
        alert('자료가 삭제되었습니다.');
        fetchResources();
      } else {
        alert('삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error('Failed to delete resource:', error);
      alert('삭제 중 오류가 발생했습니다.');
    }
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return 'N/A';
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    return `${size.toFixed(1)} ${units[unitIndex]}`;
  };

  const getResourceTypeLabel = (type: string) => {
    const types: { [key: string]: string } = {
      guide: '가이드',
      form: '서식',
      education: '교육자료',
      law: '법령',
      etc: '기타'
    };
    return types[type] || type;
  };

  // 인증 로딩 중일 때 로딩 표시
  if (authLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">인증 확인 중...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  // 인증 완료 후 권한 체크
  if (!user || user.role !== 'ADMIN') {
    return null;
  }

  return (
    <AdminLayout>
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">자료실 관리</h1>
          <Link
            href="/admin/resources/new"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            새 자료 추가
          </Link>
        </div>

        {/* 검색 필터 */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <form onSubmit={handleSearch} className="flex gap-4">
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setPage(1);
              }}
              className="border rounded px-3 py-2"
            >
              <option value="">모든 카테고리</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>

            <input
              type="text"
              placeholder="제목으로 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 border rounded px-3 py-2"
            />

            <button
              type="submit"
              className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
            >
              검색
            </button>
          </form>
        </div>

        {/* 자료 목록 */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">로딩중...</p>
            </div>
          ) : resources.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              등록된 자료가 없습니다.
            </div>
          ) : (
            <table className="min-w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    제목
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    카테고리
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    유형
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    파일
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    다운로드
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    상태
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    작성일
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    관리
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {resources.map((resource) => (
                  <tr key={resource.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {resource.title}
                          {resource.isFeatured && (
                            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                              주요
                            </span>
                          )}
                        </div>
                        {resource.description && (
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {resource.description}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {resource.category?.name || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {getResourceTypeLabel(resource.resourceType)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {resource.fileType ? (
                        <div>
                          <div className="font-medium">{resource.fileType}</div>
                          <div className="text-gray-500">
                            {formatFileSize(resource.fileSize)}
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-400">외부링크</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {resource.downloadCount}회
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        resource.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {resource.isActive ? '공개' : '비공개'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(resource.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link
                        href={`/admin/resources/${resource.id}/edit`}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        수정
                      </Link>
                      <button
                        onClick={() => handleDelete(resource.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        삭제
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <div className="mt-6 flex justify-center">
            <nav className="flex space-x-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                이전
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setPage(i + 1)}
                  className={`px-3 py-1 border rounded ${
                    page === i + 1 ? 'bg-blue-600 text-white' : ''
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                다음
              </button>
            </nav>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}