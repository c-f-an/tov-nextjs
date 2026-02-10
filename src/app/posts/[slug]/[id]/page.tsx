"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import PageHeader from "@/presentation/components/common/PageHeader";
import { Breadcrumb } from "@/presentation/components/common/Breadcrumb";

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
            items={[{ label: "토브 소식" }, { label: post.categoryName, href: "/posts/notice" }]}
            variant="light"
          />
        </PageHeader>

        {/* 게시물 본문 */}
        <article className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {/* 헤더 */}
          <div className="px-6 md:px-10 pt-8 pb-6 border-b border-gray-100">
            <div className="flex items-center gap-2 mb-5">
              <span className="inline-block px-3 py-1.5 text-xs font-medium bg-[#00357f]/10 text-[#00357f] rounded-md">
                {post.categoryName}
              </span>
              {post.isNotice && (
                <span className="inline-block px-3 py-1.5 text-xs font-medium bg-rose-50 text-rose-600 rounded-md">
                  공지
                </span>
              )}
              {post.isFeatured && (
                <span className="inline-block px-3 py-1.5 text-xs font-medium bg-amber-50 text-amber-600 rounded-md">
                  주요
                </span>
              )}
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-5 leading-tight">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500">
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                {post.author.name}
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {formatDate(post.publishedAt || post.createdAt)}
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                {post.views.toLocaleString()}
              </span>
            </div>
          </div>

          {/* 썸네일 */}
          {post.thumbnail && (
            <div className="px-6 md:px-10 pt-8">
              <img
                src={post.thumbnail}
                alt={post.title}
                className="w-full rounded-xl"
              />
            </div>
          )}

          {/* 내용 */}
          <div className="px-6 md:px-10 py-8">
            <div
              className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-600 prose-a:text-[#00357f] prose-img:rounded-xl"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>
        </article>

        {/* 목록 버튼 */}
        <div className="mt-8 flex justify-center">
          <Link
            href={`/posts/${post.categorySlug}`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-700 rounded-xl border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-colors shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
            목록으로 돌아가기
          </Link>
        </div>
      </div>
    </main >
  );
}
