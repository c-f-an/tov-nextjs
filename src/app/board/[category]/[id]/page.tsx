import { notFound } from 'next/navigation';
import Link from 'next/link';
import { formatDateTime } from '@/lib/utils/date';

interface PostDetailPageProps {
  params: { category: string; id: string };
}

async function getPost(postId: number) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/posts/${postId}`,
    { cache: 'no-store' }
  );

  if (!response.ok) {
    if (response.status === 404) {
      notFound();
    }
    throw new Error('Failed to fetch post');
  }

  return response.json();
}

// Category name mapping for breadcrumb
const categoryNames: Record<string, string> = {
  'notice': '공지사항',
  'news': '토브소식',
  'press': '언론보도',
  'publication': '발간자료',
  'gallery': '사진자료'
};

export default async function PostDetailPage({ params }: PostDetailPageProps) {
  const postId = parseInt(params.id);
  
  if (isNaN(postId)) {
    notFound();
  }

  const post = await getPost(postId);
  const categoryName = categoryNames[params.category] || '게시판';

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-8">
        <ol className="flex items-center space-x-2 text-sm text-gray-600">
          <li>
            <Link href="/" className="hover:text-blue-600">홈</Link>
          </li>
          <li>
            <span className="mx-2">/</span>
          </li>
          <li>
            <Link href="/board" className="hover:text-blue-600">게시판</Link>
          </li>
          <li>
            <span className="mx-2">/</span>
          </li>
          <li>
            <Link href={`/board/${params.category}`} className="hover:text-blue-600">
              {categoryName}
            </Link>
          </li>
          <li>
            <span className="mx-2">/</span>
          </li>
          <li className="text-gray-900 font-medium">게시글</li>
        </ol>
      </nav>

      {/* Post Content */}
      <article className="bg-white rounded-lg shadow-sm">
        {/* Post Header */}
        <div className="border-b px-6 py-4">
          <h1 className="text-2xl font-bold mb-4">
            {post.isNotice && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mr-2">
                공지
              </span>
            )}
            {post.title}
          </h1>
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center space-x-4">
              <span>작성자: {post.user?.name || '관리자'}</span>
              <span>작성일: {formatDateTime(post.createdAt)}</span>
              <span>조회수: {post.viewCount}</span>
            </div>
          </div>
        </div>

        {/* Post Body */}
        <div className="px-6 py-8">
          {/* Attachments */}
          {post.attachmentUrls.length > 0 && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-medium text-gray-700 mb-2">첨부파일</h3>
              <ul className="space-y-1">
                {post.attachmentUrls.map((url: string, index: number) => (
                  <li key={index}>
                    <a
                      href={url}
                      download
                      className="text-sm text-blue-600 hover:underline flex items-center"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      파일 {index + 1}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Content */}
          <div
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>

        {/* Post Footer */}
        <div className="border-t px-6 py-4">
          <div className="flex justify-between items-center">
            <Link
              href={`/board/${params.category}`}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              목록으로
            </Link>
            <div className="flex space-x-2">
              <button className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors">
                수정
              </button>
              <button className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors">
                삭제
              </button>
            </div>
          </div>
        </div>
      </article>

      {/* Navigation to Previous/Next Posts */}
      <div className="mt-8 border-t border-b">
        <div className="divide-y">
          <Link href="#" className="flex items-center justify-between py-3 hover:bg-gray-50 px-4 -mx-4">
            <div className="flex items-center">
              <span className="text-sm text-gray-500 mr-2">이전글</span>
              <span className="text-sm">이전 게시글 제목이 여기에 표시됩니다</span>
            </div>
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </Link>
          <Link href="#" className="flex items-center justify-between py-3 hover:bg-gray-50 px-4 -mx-4">
            <div className="flex items-center">
              <span className="text-sm text-gray-500 mr-2">다음글</span>
              <span className="text-sm">다음 게시글 제목이 여기에 표시됩니다</span>
            </div>
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}