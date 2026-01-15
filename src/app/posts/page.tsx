"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Breadcrumb } from "@/presentation/components/common/Breadcrumb";

import PageHeader from "@/presentation/components/common/PageHeader";

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

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadData();
  }, [currentPage]);

  const loadData = async () => {
    setLoading(true);
    try {
      // 카테고리 로드
      const catResponse = await fetch('/api/categories');
      const catData = await catResponse.json();
      const postsCategories = catData.filter((cat: Category) =>
        ['notice', 'news', 'activity', 'media', 'publication', 'laws'].includes(cat.type)
      );
      setCategories(postsCategories);

      // 게시물 로드
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '12'
      });

      const response = await fetch(`/api/posts?${params}`);
      const data = await response.json();
      setPosts(data.items);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-16">
        <Breadcrumb items={[{ label: "토브 소식" }]} />
        <PageHeader
          title="토브 소식"
          description="토브협회의 다양한 소식과 공지사항을 확인하세요"
        />

        <div className="container mx-auto px-4 py-12">
          {/* 카테고리 탭 */}
          <div className="flex flex-wrap gap-2 mb-8">
            <Link
              href="/posts"
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/80"
            >
              전체
            </Link>
            {categories.map(cat => (
              <Link
                key={cat.id}
                href={`/posts/${cat.slug}`}
                className="px-4 py-2 bg-white text-gray-700 rounded-md hover:bg-gray-100 border"
              >
                {cat.name}
              </Link>
            ))}
          </div>

          {/* 게시물 그리드 */}
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/posts/${post.categorySlug}/${post.id}`}
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
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                          {post.categoryName}
                        </span>
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
                        {post.summary}
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