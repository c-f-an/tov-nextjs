'use client';

import Link from 'next/link';
import { formatDate } from '@/lib/utils/date';
import { PostDto } from '@/core/application/dtos/PostDto';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Eye, Calendar, User, Paperclip } from 'lucide-react';

interface PostListProps {
  posts: PostDto[];
  categorySlug: string;
}

export function PostList({ posts, categorySlug }: PostListProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {posts.length === 0 ? (
        <div className="col-span-full bg-white rounded-lg shadow-sm p-8 text-center text-gray-500">
          등록된 게시글이 없습니다.
        </div>
      ) : (
        posts.map((post, index) => (
          <Link key={post.id} href={`/board/${categorySlug}/${post.id}`}>
            <Card className="h-full hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {post.isNotice ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        공지
                      </span>
                    ) : (
                      <span className="text-sm text-gray-500">#{posts.length - index}</span>
                    )}
                    {post.attachmentUrls.length > 0 && (
                      <Paperclip className="h-4 w-4 text-gray-400" />
                    )}
                  </div>
                </div>
                <CardTitle className="text-lg line-clamp-2 hover:text-blue-600 transition-colors">
                  {post.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {post.content && (
                  <CardDescription className="line-clamp-3 text-gray-600">
                    {post.content.replace(/<[^>]*>/g, '').substring(0, 100)}...
                  </CardDescription>
                )}
              </CardContent>
              <CardFooter className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {post.user?.name || '관리자'}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {post.viewCount}
                  </span>
                </div>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {formatDate(post.createdAt)}
                </span>
              </CardFooter>
            </Card>
          </Link>
        ))
      )}
    </div>
  );
}