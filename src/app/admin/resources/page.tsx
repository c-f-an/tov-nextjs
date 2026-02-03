'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/presentation/contexts/AuthContext';
import Link from 'next/link';
import {
  Plus,
  Search,
  FileText,
  Download,
  ExternalLink,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Folder,
  Star,
  Eye,
  EyeOff,
  Files
} from 'lucide-react';

interface ResourceFile {
  id: number;
  originalFilename: string;
  fileType: string;
  fileSize: number;
}

interface Resource {
  id: number;
  categoryId: number;
  title: string;
  description: string | null;
  resourceType: string;
  fileType: string | null;
  originalFilename: string | null;
  fileSize: number | null;
  filePath: string | null;
  externalLink: string | null;
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
  files?: ResourceFile[];
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
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">인증 확인 중...</p>
          </div>
        </div>
    );
  }

  // 인증 완료 후 권한 체크
  if (!user || user.role !== 'ADMIN') {
    return null;
  }

  // 파일 상태를 판단하는 헬퍼 함수
  const getFileStatus = (resource: Resource) => {
    if (resource.files && resource.files.length > 0) {
      return { type: 'files', count: resource.files.length };
    }
    if (resource.filePath) {
      return { type: 'file', count: 1 };
    }
    if (resource.externalLink) {
      return { type: 'external', count: 0 };
    }
    return { type: 'none', count: 0 };
  };

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Folder className="h-6 w-6 text-primary" />
            </div>
            자료실 관리
          </h1>
          <p className="mt-1 text-sm text-gray-500">자료실 콘텐츠를 관리합니다</p>
        </div>
        <Link
          href="/admin/resources/new"
          className="inline-flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-lg hover:bg-primary/90 transition-all shadow-sm hover:shadow-md font-medium"
        >
          <Plus className="h-5 w-5" />
          새 자료 추가
        </Link>
      </div>

      {/* 검색 필터 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Folder className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setPage(1);
              }}
              className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none min-w-[160px]"
            >
              <option value="">모든 카테고리</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="제목으로 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>

          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-lg hover:bg-gray-800 transition-all font-medium"
          >
            <Search className="h-4 w-4" />
            검색
          </button>
        </form>
      </div>

      {/* 자료 목록 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary border-t-transparent"></div>
            <p className="mt-4 text-gray-500">자료를 불러오는 중...</p>
          </div>
        ) : resources.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="p-4 bg-gray-100 rounded-full mb-4">
              <FileText className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-gray-500 font-medium">등록된 자료가 없습니다</p>
            <p className="text-sm text-gray-400 mt-1">새 자료를 추가해보세요</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-fixed">
              <colgroup>
                <col className="w-[200px]" />
                <col className="w-[120px]" />
                <col className="w-[100px]" />
                <col className="w-[140px]" />
                <col className="w-[100px]" />
                <col className="w-[100px]" />
                <col className="w-[120px]" />
                <col className="w-[100px]" />
              </colgroup>
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                    제목
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                    카테고리
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                    유형
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                    파일
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                    다운로드
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                    상태
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                    작성일
                  </th>
                  <th className="px-4 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                    관리
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {resources.map((resource) => {
                  const fileStatus = getFileStatus(resource);
                  return (
                    <tr key={resource.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="min-w-0">
                          <Link
                            href={`/admin/resources/${resource.id}/edit`}
                            className="text-sm font-medium text-gray-900 hover:text-primary transition-colors truncate block"
                            title={resource.title}
                          >
                            {resource.title}
                          </Link>
                          {resource.isFeatured && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700 mt-1">
                              <Star className="h-3 w-3" />
                              주요
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="text-sm text-gray-600">
                          {resource.category?.name || '-'}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                          {getResourceTypeLabel(resource.resourceType)}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {fileStatus.type === 'files' ? (
                          <div className="flex items-center gap-2">
                            <Files className="h-4 w-4 text-blue-600 flex-shrink-0" />
                            <span className="text-sm text-gray-900 font-medium">{fileStatus.count}개 파일</span>
                          </div>
                        ) : fileStatus.type === 'file' ? (
                          <div className="flex items-center gap-2">
                            <Download className="h-4 w-4 text-green-600 flex-shrink-0" />
                            <div>
                              <div className="text-xs font-medium text-gray-900">{resource.fileType}</div>
                              <div className="text-xs text-gray-500">{formatFileSize(resource.fileSize)}</div>
                            </div>
                          </div>
                        ) : fileStatus.type === 'external' ? (
                          <div className="flex items-center gap-2">
                            <ExternalLink className="h-4 w-4 text-amber-600 flex-shrink-0" />
                            <span className="text-xs text-amber-700 font-medium">외부링크</span>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">없음</span>
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Download className="h-4 w-4 text-gray-400 flex-shrink-0" />
                          <span className="text-sm text-gray-600">{resource.downloadCount}회</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {resource.isActive ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                            <Eye className="h-3 w-3" />
                            공개
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                            <EyeOff className="h-3 w-3" />
                            비공개
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="text-sm text-gray-500">
                          {new Date(resource.createdAt).toLocaleDateString('ko-KR')}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            href={`/admin/resources/${resource.id}/edit`}
                            className="p-2 text-gray-500 hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                            title="수정"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(resource.id)}
                            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                            title="삭제"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="inline-flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft className="h-4 w-4" />
            이전
          </button>

          <div className="flex items-center gap-1">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => setPage(i + 1)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                  page === i + 1
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="inline-flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            다음
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
