'use client';

import Link from 'next/link';
import { formatDate } from '@/lib/utils/date';
import { PostDto } from '@/core/application/dtos/PostDto';

interface PostListProps {
  posts: PostDto[];
  categorySlug: string;
}

export function PostList({ posts, categorySlug }: PostListProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                번호
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                제목
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                작성자
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                조회수
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                작성일
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {posts.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                  등록된 게시글이 없습니다.
                </td>
              </tr>
            ) : (
              posts.map((post, index) => (
                <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {post.isNotice ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                        공지
                      </span>
                    ) : (
                      posts.length - index
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/board/${categorySlug}/${post.id}`}
                      className="text-sm text-gray-900 hover:text-blue-600 font-medium line-clamp-1"
                    >
                      {post.title}
                      {post.attachmentUrls.length > 0 && (
                        <span className="ml-1 text-gray-400">
                          <svg className="inline w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                          </svg>
                        </span>
                      )}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-center text-sm text-gray-500 hidden sm:table-cell">
                    {post.user?.name || '관리자'}
                  </td>
                  <td className="px-4 py-3 text-center text-sm text-gray-500 hidden md:table-cell">
                    {post.viewCount}
                  </td>
                  <td className="px-4 py-3 text-center text-sm text-gray-500 whitespace-nowrap">
                    {formatDate(post.createdAt)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}