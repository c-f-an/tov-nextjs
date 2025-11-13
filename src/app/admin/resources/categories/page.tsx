'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/presentation/contexts/AuthContext';
import Link from 'next/link';

interface ResourceCategory {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function AdminResourceCategoriesPage() {
  const router = useRouter();
  const { user, accessToken, loading: authLoading } = useAuth();
  const [categories, setCategories] = useState<ResourceCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<ResourceCategory>>({});
  const [isCreating, setIsCreating] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: '',
    slug: '',
    description: '',
    icon: 'FileText',
    sortOrder: 0,
    isActive: true
  });

  const fetchCategories = useCallback(async () => {
    if (!accessToken) return;

    try {
      setLoading(true);
      const response = await fetch('/api/resources/categories', {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    if (authLoading) return;

    if (!user || user.role !== 'ADMIN') {
      router.push('/login?redirect=/admin/resources/categories');
      return;
    }

    fetchCategories();
  }, [user, authLoading, router, fetchCategories]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/resources/categories', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newCategory)
      });

      if (response.ok) {
        alert('카테고리가 생성되었습니다.');
        setIsCreating(false);
        setNewCategory({
          name: '',
          slug: '',
          description: '',
          icon: 'FileText',
          sortOrder: 0,
          isActive: true
        });
        fetchCategories();
      } else {
        const error = await response.json();
        alert(`생성 실패: ${error.error || '알 수 없는 오류'}`);
      }
    } catch (error) {
      console.error('Failed to create category:', error);
      alert('생성 중 오류가 발생했습니다.');
    }
  };

  const handleEdit = (category: ResourceCategory) => {
    setEditingId(category.id);
    setEditForm(category);
  };

  const handleUpdate = async (id: number) => {
    try {
      const response = await fetch(`/api/resources/categories/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editForm)
      });

      if (response.ok) {
        alert('카테고리가 수정되었습니다.');
        setEditingId(null);
        setEditForm({});
        fetchCategories();
      } else {
        alert('수정에 실패했습니다.');
      }
    } catch (error) {
      console.error('Failed to update category:', error);
      alert('수정 중 오류가 발생했습니다.');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('정말 이 카테고리를 삭제하시겠습니까?\n이 카테고리에 속한 모든 자료도 함께 삭제됩니다.')) {
      return;
    }

    try {
      const response = await fetch(`/api/resources/categories/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (response.ok) {
        alert('카테고리가 삭제되었습니다.');
        fetchCategories();
      } else {
        alert('삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error('Failed to delete category:', error);
      alert('삭제 중 오류가 발생했습니다.');
    }
  };

  const iconOptions = ['FileText', 'Calculator', 'Receipt', 'Scale', 'Book', 'Folder'];

  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">인증 확인 중...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'ADMIN') {
    return null;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">자료실 카테고리 관리</h1>
        <div className="flex gap-2">
          <Link
            href="/admin/resources"
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            자료 목록으로
          </Link>
          <button
            onClick={() => setIsCreating(!isCreating)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {isCreating ? '취소' : '새 카테고리 추가'}
          </button>
        </div>
      </div>

      {/* 새 카테고리 생성 폼 */}
      {isCreating && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-bold mb-4">새 카테고리 생성</h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">카테고리명 *</label>
                <input
                  type="text"
                  required
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                  placeholder="예: 종교인소득"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">슬러그 (URL) *</label>
                <input
                  type="text"
                  required
                  value={newCategory.slug}
                  onChange={(e) => setNewCategory({ ...newCategory, slug: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                  placeholder="예: religious-income"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">설명</label>
              <textarea
                value={newCategory.description}
                onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                className="w-full border rounded px-3 py-2"
                rows={3}
                placeholder="카테고리에 대한 설명"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">아이콘</label>
                <select
                  value={newCategory.icon}
                  onChange={(e) => setNewCategory({ ...newCategory, icon: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                >
                  {iconOptions.map(icon => (
                    <option key={icon} value={icon}>{icon}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">정렬 순서</label>
                <input
                  type="number"
                  value={newCategory.sortOrder}
                  onChange={(e) => setNewCategory({ ...newCategory, sortOrder: parseInt(e.target.value) })}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">상태</label>
                <select
                  value={newCategory.isActive ? 'true' : 'false'}
                  onChange={(e) => setNewCategory({ ...newCategory, isActive: e.target.value === 'true' })}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="true">활성</option>
                  <option value="false">비활성</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-4 py-2 border rounded hover:bg-gray-50"
              >
                취소
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                생성
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 카테고리 목록 */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">로딩중...</p>
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            등록된 카테고리가 없습니다.
          </div>
        ) : (
          <table className="min-w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  순서
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  카테고리명
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  슬러그
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  설명
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  아이콘
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  상태
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  관리
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {categories.map((category) => (
                <tr key={category.id}>
                  {editingId === category.id ? (
                    // 수정 모드
                    <>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="number"
                          value={editForm.sortOrder}
                          onChange={(e) => setEditForm({ ...editForm, sortOrder: parseInt(e.target.value) })}
                          className="w-20 border rounded px-2 py-1"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="text"
                          value={editForm.name}
                          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                          className="w-full border rounded px-2 py-1"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="text"
                          value={editForm.slug}
                          onChange={(e) => setEditForm({ ...editForm, slug: e.target.value })}
                          className="w-full border rounded px-2 py-1"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="text"
                          value={editForm.description || ''}
                          onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                          className="w-full border rounded px-2 py-1"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={editForm.icon || 'FileText'}
                          onChange={(e) => setEditForm({ ...editForm, icon: e.target.value })}
                          className="border rounded px-2 py-1"
                        >
                          {iconOptions.map(icon => (
                            <option key={icon} value={icon}>{icon}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={editForm.isActive ? 'true' : 'false'}
                          onChange={(e) => setEditForm({ ...editForm, isActive: e.target.value === 'true' })}
                          className="border rounded px-2 py-1"
                        >
                          <option value="true">활성</option>
                          <option value="false">비활성</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleUpdate(category.id)}
                          className="text-green-600 hover:text-green-900 mr-3"
                        >
                          저장
                        </button>
                        <button
                          onClick={() => {
                            setEditingId(null);
                            setEditForm({});
                          }}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          취소
                        </button>
                      </td>
                    </>
                  ) : (
                    // 보기 모드
                    <>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {category.sortOrder}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {category.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {category.slug}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {category.description || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {category.icon || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          category.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {category.isActive ? '활성' : '비활성'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleEdit(category)}
                          className="text-indigo-600 hover:text-indigo-900 mr-4"
                        >
                          수정
                        </button>
                        <button
                          onClick={() => handleDelete(category.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          삭제
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* 안내 메시지 */}
      <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h3 className="font-semibold text-yellow-800 mb-2">주의사항</h3>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• 카테고리 삭제 시 해당 카테고리에 속한 모든 자료가 함께 삭제됩니다.</li>
          <li>• 슬러그(slug)는 URL에 사용되므로 영문과 하이픈(-)만 사용하세요.</li>
          <li>• 정렬 순서는 숫자가 작을수록 먼저 표시됩니다.</li>
        </ul>
      </div>
    </div>
  );
}
