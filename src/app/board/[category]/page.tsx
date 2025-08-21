import { notFound } from 'next/navigation';
import Link from 'next/link';
import { PostList } from '@/presentation/components/board/PostList';
import { Pagination } from '@/presentation/components/board/Pagination';

// Category slug mapping
const categoryMapping: Record<string, { name: string; description: string }> = {
  'notice': { name: '공지사항', description: '토브협회의 공지사항입니다.' },
  'news': { name: '토브소식', description: '토브협회의 최신 소식을 전합니다.' },
  'media': { name: '언론보도', description: '토브협회 관련 언론 보도자료입니다.' },
  'publication': { name: '발간자료', description: '토브협회에서 발간한 자료들입니다.' },
  'resource': { name: '자료실', description: '토브협회 관련 자료들입니다.' },
  'activity': { name: '활동소식', description: '토브협회 활동 소식입니다.' }
};

interface BoardPageProps {
  params: { category: string };
  searchParams: { page?: string };
}

async function getCategory(slug: string) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/categories?slug=${slug}`,
    { cache: 'no-store' }
  );

  if (!response.ok) {
    return null;
  }

  const categories = await response.json();
  return categories.find((cat: any) => cat.slug === slug);
}

async function getPosts(categoryId: number, page: number) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/posts?categoryId=${categoryId}&page=${page}&includeNotices=true`,
      { cache: 'no-store' }
    );

    if (!response.ok) {
      // Return empty result if posts cannot be fetched
      return { posts: [], total: 0, totalPages: 1 };
    }

    return response.json();
  } catch (error) {
    // Return empty result on error
    return { posts: [], total: 0, totalPages: 1 };
  }
}

export default async function BoardPage({ params, searchParams }: BoardPageProps) {
  const categoryInfo = categoryMapping[params.category];
  
  if (!categoryInfo) {
    notFound();
  }

  // Get category from database
  const category = await getCategory(params.category);
  
  // If category doesn't exist in DB, create a mock category based on categoryMapping
  const mockCategory = category || {
    id: 999, // temporary ID
    slug: params.category,
    name: categoryInfo.name,
    description: categoryInfo.description
  };

  const currentPage = parseInt(searchParams.page || '1');
  const { posts, total, totalPages } = await getPosts(mockCategory.id, currentPage);

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
          <li className="text-gray-900 font-medium">{categoryInfo.name}</li>
        </ol>
      </nav>

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{categoryInfo.name}</h1>
        <p className="text-gray-600">{categoryInfo.description}</p>
      </div>

      {/* Search and Write Button */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="검색어를 입력하세요"
            className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">
            검색
          </button>
        </div>
        <Link
          href={`/board/${params.category}/write`}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          글쓰기
        </Link>
      </div>

      {/* Post List */}
      <PostList posts={posts} categorySlug={params.category} />

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        basePath={`/board/${params.category}`}
      />
    </div>
  );
}