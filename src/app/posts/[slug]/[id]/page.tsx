"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import PageHeader from "@/presentation/components/common/PageHeader";

interface Post {
  id: number;
  title: string;
  slug: string;
  summary: string;
  content: string;
  thumbnail: string;
  category: string;
  categoryName: string;
  categorySlug: string;
  views: number;
  isNotice: boolean;
  isFeatured: boolean;
  author: {
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function PostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const postId = params.id as string;
  const categorySlug = params.slug as string;

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (postId) {
      loadPost();
    }
  }, [postId]);

  const loadPost = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/posts/${postId}`);
      if (!response.ok) {
        throw new Error("Post not found");
      }
      const data = await response.json();
      setPost(data);
    } catch (error) {
      console.error("Failed to load post:", error);
      router.push("/posts");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">로딩 중...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">게시물을 찾을 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader title={post.categoryName} subtitle="" />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* 브레드크럼 */}
          <div className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
            <Link href="/" className="hover:text-gray-700">
              홈
            </Link>
            <span>/</span>
            <Link href="/posts" className="hover:text-gray-700">
              토브 소식
            </Link>
            <span>/</span>
            <Link
              href={`/posts/${post.categorySlug}`}
              className="hover:text-gray-700"
            >
              {post.categoryName}
            </Link>
          </div>

          {/* 게시물 본문 */}
          <article className="bg-white rounded-lg shadow overflow-hidden">
            {/* 헤더 */}
            <div className="p-6 md:p-8 border-b">
              <div className="flex items-center gap-2 mb-4">
                <span className="inline-block px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                  {post.categoryName}
                </span>
                {post.isNotice && (
                  <span className="inline-block px-3 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                    공지
                  </span>
                )}
                {post.isFeatured && (
                  <span className="inline-block px-3 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                    주요
                  </span>
                )}
              </div>

              <h1 className="text-2xl md:text-3xl font-bold mb-4">
                {post.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                <span>작성자: {post.author.name}</span>
                <span>
                  작성일: {formatDate(post.publishedAt || post.createdAt)}
                </span>
                <span>조회수: {post.views}</span>
              </div>
            </div>

            {/* 썸네일 */}
            {post.thumbnail && (
              <div className="px-6 md:px-8 py-6">
                <img
                  src={post.thumbnail}
                  alt={post.title}
                  className="w-full rounded-lg"
                />
              </div>
            )}

            {/* 내용 */}
            <div className="p-6 md:p-8">
              <div
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </div>
          </article>

          {/* 목록 버튼 */}
          <div className="mt-8 flex justify-center">
            <Link
              href={`/posts/${post.categorySlug}`}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
            >
              목록으로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
