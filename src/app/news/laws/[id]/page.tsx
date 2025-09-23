import { MySQLNewsRepository } from '@/infrastructure/repositories/MySQLNewsRepository';
import { GetNewsDetailUseCase } from '@/core/application/use-cases/news/GetNewsDetailUseCase';
import Link from "next/link";
import { notFound } from 'next/navigation';

function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

interface PageProps {
  params: { id: string };
}

export default async function LawsDetailPage({ params }: PageProps) {
  const newsId = parseInt(params.id);
  
  if (isNaN(newsId)) {
    notFound();
  }

  let newsItem = null;
  try {
    const newsRepository = MySQLNewsRepository.getInstance();
    const getNewsDetailUseCase = new GetNewsDetailUseCase(newsRepository);
    newsItem = await getNewsDetailUseCase.execute(newsId);
    
    if (!newsItem || newsItem.category !== 'laws') {
      notFound();
    }
  } catch (error) {
    console.error('Failed to fetch news detail:', error);
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-indigo-600 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="mb-4">
            <Link 
              href="/news/laws"
              className="text-white/80 hover:text-white inline-flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              관계법령 목록으로
            </Link>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold">관계법령</h1>
        </div>
      </section>

      {/* Content */}
      <article className="py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-lg shadow-md p-8">
            {/* Header */}
            <header className="mb-8 pb-8 border-b">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                {newsItem.title}
              </h2>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                <span className="inline-flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                  </svg>
                  {newsItem.author}
                </span>
                <span className="inline-flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {formatDate(newsItem.publishedAt || newsItem.createdAt)}
                </span>
                <span className="inline-flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  조회수 {newsItem.views.toLocaleString()}
                </span>
              </div>
            </header>

            {/* Image */}
            {newsItem.imageUrl && (
              <div className="mb-8">
                <img
                  src={newsItem.imageUrl}
                  alt={newsItem.title}
                  className="w-full rounded-lg"
                />
              </div>
            )}

            {/* Content */}
            <div className="prose prose-lg max-w-none">
              <div className="whitespace-pre-wrap">{newsItem.content}</div>
            </div>

            {/* Related Links */}
            <div className="mt-8 p-6 bg-indigo-50 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">관련 링크</h3>
              <div className="space-y-2">
                <a
                  href="https://www.law.go.kr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-indigo-600 hover:text-indigo-700"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  법령정보센터에서 전문 보기
                </a>
              </div>
            </div>

            {/* Navigation */}
            <div className="mt-12 pt-8 border-t">
              <Link
                href="/news/laws"
                className="inline-flex items-center text-indigo-600 hover:text-indigo-700 font-medium"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                목록으로 돌아가기
              </Link>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}