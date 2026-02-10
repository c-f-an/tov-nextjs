'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Editor } from '@/presentation/components/admin/Editor';
import { S3ThumbnailUpload } from '@/presentation/components/common/S3ThumbnailUpload';

interface PostFormData {
  title: string;
  slug: string;
  categoryId: string;
  categoryType: string;
  content: string;
  summary: string;
  thumbnailUrl: string;
  isNotice: boolean;
  isPublished: boolean;
  tags: string[];
}

interface Category {
  id: number;
  name: string;
  type: string;
  slug: string;
}

export default function EditPostPage() {
  const router = useRouter();
  const params = useParams();
  const postId = params.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState<PostFormData>({
    title: '',
    slug: '',
    categoryId: '',
    categoryType: '',
    content: '',
    summary: '',
    thumbnailUrl: '',
    isNotice: false,
    isPublished: false,
    tags: []
  });
  const [tagInput, setTagInput] = useState('');
  const [slugError, setSlugError] = useState('');

  // 게시글 데이터 가져오기
  useEffect(() => {
    const loadData = async () => {
      await fetchCategories();
      await fetchPost();
    };
    loadData();
  }, [postId]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories', {
        credentials: 'include', // 쿠키 포함
      });
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
        return data; // 카테고리 데이터 반환
      }
      return [];
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      return [];
    }
  };

  const fetchPost = async () => {
    try {
      const response = await fetch(`/api/admin/posts/${postId}`, {
        credentials: 'include', // 쿠키 포함
      });
      if (!response.ok) {
        throw new Error('게시글을 불러올 수 없습니다.');
      }

      const post = await response.json();

      // 카테고리 정보 찾기 (최신 categories 상태 사용)
      setCategories((currentCategories) => {
        const category = currentCategories.find(c => c.type === post.categoryType || c.name === post.categoryName);

        setFormData({
          title: post.title || '',
          slug: post.slug || '',
          categoryId: category?.id.toString() || '',
          categoryType: post.categoryType || category?.type || '',
          content: post.content || '',
          summary: post.summary || '',
          thumbnailUrl: post.thumbnailUrl || '',
          isNotice: post.isNotice || false,
          isPublished: post.isPublished !== undefined ? post.isPublished : true,
          tags: post.tags || []
        });

        return currentCategories; // 상태 변경하지 않음
      });
    } catch (error) {
      console.error('Error fetching post:', error);
      alert('게시글을 불러오는데 실패했습니다.');
      router.push('/admin/posts');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      alert('제목을 입력해주세요.');
      return;
    }

    if (!formData.slug.trim()) {
      alert('Slug를 입력해주세요.');
      return;
    }

    if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      alert('Slug는 영문 소문자, 숫자, 하이픈(-)만 사용할 수 있습니다.');
      return;
    }

    if (!formData.categoryId && !formData.categoryType) {
      alert('카테고리를 선택해주세요.');
      return;
    }

    if (!formData.content.trim()) {
      alert('내용을 입력해주세요.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/admin/posts/${postId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // 쿠키 포함
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || '게시글 수정에 실패했습니다.');
      }

      alert('게시글이 성공적으로 수정되었습니다.');
      router.push('/admin/posts');
    } catch (error) {
      console.error('Error updating post:', error);
      alert(error instanceof Error ? error.message : '게시글 수정에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/admin/posts/${postId}`, {
        method: 'DELETE',
        credentials: 'include', // 쿠키 포함
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || '게시글 삭제에 실패했습니다.');
      }

      alert('게시글이 삭제되었습니다.');
      router.push('/admin/posts');
    } catch (error) {
      console.error('Error deleting post:', error);
      alert(error instanceof Error ? error.message : '게시글 삭제에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCategory = categories.find(c => c.id.toString() === e.target.value);
    if (selectedCategory) {
      setFormData(prev => ({
        ...prev,
        categoryId: selectedCategory.id.toString(),
        categoryType: selectedCategory.type
      }));
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };


  // 카테고리를 타입별로 그룹화
  const groupedCategories = categories.reduce((acc, category) => {
    if (!acc[category.type]) {
      acc[category.type] = [];
    }
    acc[category.type].push(category);
    return acc;
  }, {} as Record<string, Category[]>);

  const categoryTypeLabels: Record<string, string> = {
    'notice': '공지사항',
    'news': '토브소식',
    'media': '언론보도',
    'publication': '발간자료',
    'resource': '자료실',
    'activity': '활동소식'
  };

  if (isLoading) {
    return (
        <div className="flex justify-center items-center min-h-screen">
          <p className="text-gray-500">로딩 중...</p>
        </div>
    );
  }

  return (
      <div className="max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link
              href="/admin/posts"
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <h1 className="text-2xl font-bold">게시글 수정</h1>
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 메인 컨텐츠 영역 */}
            <div className="lg:col-span-2 space-y-6">
              {/* 제목 */}
              <div className="bg-white rounded-lg shadow p-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  제목 *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="게시글 제목을 입력하세요"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isSubmitting}
                />
              </div>

              {/* Slug */}
              <div className="bg-white rounded-lg shadow p-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Slug (URL 경로) *
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => {
                    const value = e.target.value.toLowerCase();
                    // 영문, 숫자, 하이픈만 허용
                    if (/^[a-z0-9-]*$/.test(value)) {
                      setFormData(prev => ({ ...prev, slug: value }));
                      setSlugError('');
                    } else {
                      setSlugError('영문 소문자, 숫자, 하이픈(-)만 사용할 수 있습니다.');
                    }
                  }}
                  placeholder="예: my-first-post"
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${slugError ? 'border-red-500' : ''}`}
                  disabled={isSubmitting}
                />
                {slugError && (
                  <p className="mt-1 text-sm text-red-500">{slugError}</p>
                )}
                <p className="mt-2 text-sm text-gray-500">
                  URL에 사용될 고유 식별자입니다. 영문 소문자, 숫자, 하이픈(-)만 사용 가능합니다.
                  <br />
                  예시: /posts/notice/<span className="font-medium text-blue-600">{formData.slug || 'my-first-post'}</span>
                </p>
              </div>

              {/* 요약 */}
              <div className="bg-white rounded-lg shadow p-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  요약
                </label>
                <textarea
                  value={formData.summary}
                  onChange={(e) => setFormData(prev => ({ ...prev, summary: e.target.value }))}
                  placeholder="게시글 요약을 입력하세요 (검색 결과에 표시됩니다)"
                  rows={3}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isSubmitting}
                />
              </div>

              {/* 내용 */}
              <div className="bg-white rounded-lg shadow p-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  내용 *
                </label>
                <Editor
                  value={formData.content}
                  onChange={(value) => setFormData(prev => ({ ...prev, content: value }))}
                  placeholder="게시글 내용을 입력하세요..."
                  minHeight="500px"
                />
              </div>
            </div>

            {/* 사이드바 */}
            <div className="space-y-6">
              {/* 발행 설정 */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium mb-4">발행 설정</h3>

                {/* 카테고리 */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    카테고리 *
                  </label>
                  <select
                    value={formData.categoryId}
                    onChange={handleCategoryChange}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isSubmitting}
                  >
                    <option value="">카테고리 선택</option>
                    {Object.entries(groupedCategories).map(([type, cats]) => (
                      <optgroup key={type} label={categoryTypeLabels[type] || type}>
                        {cats.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </div>

                {/* 공개 상태 */}
                <div className="mb-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.isPublished}
                      onChange={(e) => setFormData(prev => ({ ...prev, isPublished: e.target.checked }))}
                      className="rounded border-gray-300"
                      disabled={isSubmitting}
                    />
                    <span className="text-sm font-medium text-gray-700">공개</span>
                  </label>
                </div>

                {/* 공지사항 설정 */}
                <div className="mb-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.isNotice}
                      onChange={(e) => setFormData(prev => ({ ...prev, isNotice: e.target.checked }))}
                      className="rounded border-gray-300"
                      disabled={isSubmitting}
                    />
                    <span className="text-sm font-medium text-gray-700">공지사항으로 설정</span>
                  </label>
                </div>

                {/* 수정 버튼 */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {isSubmitting ? '처리 중...' : '수정하기'}
                </button>
              </div>

              {/* 썸네일 */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium mb-4">썸네일</h3>

                <div className="space-y-4">
                  {formData.thumbnailUrl && (
                    <div className="relative">
                      <img
                        src={formData.thumbnailUrl}
                        alt="썸네일 미리보기"
                        className="w-full h-40 object-cover rounded-md"
                      />
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, thumbnailUrl: '' }))}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  )}

                  {/* S3 썸네일 업로드 (자동 리사이징) */}
                  <S3ThumbnailUpload
                    onUploadSuccess={(url) => setFormData(prev => ({ ...prev, thumbnailUrl: url }))}
                    onUploadError={(error) => alert(error)}
                    folder="posts/thumbnails"
                    buttonText="썸네일 이미지 업로드"
                    maxSize={10}
                    postId={postId}
                    categoryId={formData.categoryId || 'uncategorized'}
                  />

                  <div className="relative">
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
                      value={formData.thumbnailUrl}
                      onChange={(e) => {
                        const value = e.target.value;
                        // base64 데이터 방지
                        if (value.startsWith('data:')) {
                          alert('이미지 데이터를 직접 붙여넣을 수 없습니다. S3 업로드 버튼을 사용하거나 외부 URL을 입력하세요.');
                          return;
                        }
                        setFormData(prev => ({ ...prev, thumbnailUrl: value }));
                      }}
                      placeholder="https://example.com/image.jpg"
                      className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
              </div>

              {/* 태그 */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium mb-4">태그</h3>

                <div className="space-y-3">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                      placeholder="태그 입력"
                      className="flex-1 px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={isSubmitting}
                    />
                    <button
                      type="button"
                      onClick={handleAddTag}
                      disabled={isSubmitting}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-sm"
                    >
                      추가
                    </button>
                  </div>

                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(tag)}
                            className="ml-2 hover:text-blue-600"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
  );
}