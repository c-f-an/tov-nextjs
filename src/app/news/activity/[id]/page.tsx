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

export default async function ActivityDetailPage({ params }: PageProps) {
  const newsId = parseInt(params.id);
  
  if (isNaN(newsId)) {
    notFound();
  }

  let newsItem = null;
  try {
    const newsRepository = new MySQLNewsRepository();
    const getNewsDetailUseCase = new GetNewsDetailUseCase(newsRepository);
    newsItem = await getNewsDetailUseCase.execute(newsId);
    
    if (!newsItem || newsItem.category !== 'activity') {
      notFound();
    }
  } catch (error) {
    console.error('Failed to fetch news detail:', error);
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-green-600 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="mb-4">
            <Link 
              href="/news/activity"
              className="text-white/80 hover:text-white inline-flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              활동소식 목록으로
            </Link>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold">활동소식</h1>
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
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

            {/* Navigation */}
            <div className="mt-12 pt-8 border-t">
              <Link
                href="/news/activity"
                className="inline-flex items-center text-green-600 hover:text-green-700 font-medium"
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