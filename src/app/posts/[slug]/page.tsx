"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import PageHeader from "@/presentation/components/common/PageHeader";
import { Breadcrumb } from "@/presentation/components/common/Breadcrumb";

interface Post {
  id: number;
  title: string;
  slug: string;
  summary: string;
  thumbnail: string;
  category: string;
  categoryName: string;
  categorySlug: string;
  views: number;
  isNotice: boolean;
  createdAt: string;
  publishedAt: string;
}

interface Category {
  id: number;
  name: string;
  slug: string;
  type: string;
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export default function CategoryPostsPage() {
  const params = useParams();
  const categorySlug = params.slug as string;

  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    if (categorySlug) {
      loadPosts();
    }
  }, [categorySlug, currentPage]);

  const loadCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      const postsCategories = data.filter((cat: Category) =>
        ['notice', 'news', 'activity', 'media', 'publication', 'laws'].includes(cat.type)
      );
      setCategories(postsCategories);

      const current = postsCategories.find((cat: Category) => cat.slug === categorySlug);
      setCurrentCategory(current);
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };

  const loadPosts = async () => {
    setLoading(true);
    try {
      // slug를 그대로 사용 (API에서 slug와 type 모두 처리)
      const params = new URLSearchParams({
        category: categorySlug,
        page: currentPage.toString(),
        limit: '12'
      });

      const response = await fetch(`/api/posts?${params}`);
      const data = await response.json();
      setPosts(data.items);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Failed to load posts:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <PageHeader
          title={<></>}
          description=""
          backgroundImage={`/menu-header/header-bg-posts-${categorySlug}.webp`}
          overlayColor="#00357f"
          overlayOpacity={0}
        >
          <Breadcrumb
            items={[{ label: "토브 소식" }, { label: currentCategory?.name || "" }]}
            variant="light"
          />
        </PageHeader>

        <div className="container mx-auto pb-2">
          {/* 카테고리 탭 */}
          <div className="flex overflow-x-auto md:flex-wrap gap-2 mb-4 pb-2 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide">
            {categories.map(cat => (
              <Link
                key={cat.id}
                href={`/posts/${cat.slug}`}
                className={`px-4 py-2 rounded-md whitespace-nowrap flex-shrink-0 md:flex-shrink ${cat.slug === categorySlug
                  ? 'bg-primary text-primary-foreground hover:bg-primary/75'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border'
                  }`}
              >
                {cat.name}
              </Link>
            ))}
          </div>

          {/* 게시물 목록 */}
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">로딩 중...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">게시물이 없습니다.</p>
            </div>
          ) : (
            <>
              {/* 카드 뷰 */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/posts/${post.categorySlug}/${post.slug}`}
                    className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden group"
                  >
                    {post.thumbnail && (
                      <div className="aspect-video bg-gray-100 overflow-hidden">
                        <img
                          src={post.thumbnail}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                    )}
                    {!post.thumbnail && (
                      <div className="aspect-video bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
                        <div className="text-center">
                          <svg className="w-12 h-12 mx-auto text-blue-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <p className="text-blue-400 text-sm font-medium">{currentCategory?.name || '게시물'}</p>
                        </div>
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-2">
                        {post.isNotice && (
                          <span className="inline-block px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded">
                            공지
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-semibold mb-2 line-clamp-2 group-hover:text-blue-600">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                        {post.summary || ''}
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{formatDate(post.publishedAt || post.createdAt)}</span>
                        <span>조회 {post.views}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* 페이지네이션 */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-12">
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 disabled:text-gray-300 disabled:cursor-not-allowed"
                    >
                      이전
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-2 rounded-md ${currentPage === page
                          ? 'bg-primary text-primary-foreground'
                          : 'text-gray-700 hover:bg-gray-100'
                          }`}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 disabled:text-gray-300 disabled:cursor-not-allowed"
                    >
                      다음
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </main>
  );
}