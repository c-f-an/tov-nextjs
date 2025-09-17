import { MySQLNewsRepository } from '@/infrastructure/repositories/MySQLNewsRepository';
import { GetNewsListUseCase } from '@/core/application/use-cases/news/GetNewsListUseCase';
import Link from "next/link";

function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export default async function PublicationPage() {
  let newsItems = [];
  try {
    const newsRepository = new MySQLNewsRepository();
    const getNewsListUseCase = new GetNewsListUseCase(newsRepository);
    const result = await getNewsListUseCase.execute({
      category: 'publication',
      limit: 12,
      isPublished: true
    });
    newsItems = result.items;
  } catch (error) {
    console.error('Failed to fetch news:', error);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-orange-600 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">정기간행물</h1>
          <p className="text-xl">토브협회가 발행하는 소식지와 간행물을 확인하세요</p>
        </div>
      </section>
      
      <section className="py-12">
        <div className="container mx-auto px-4">
          {newsItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {newsItems.map((item) => (
                <Link key={item.id} href={`/news/publication/${item.id}`} className="block">
                  <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 h-full">
                    <div className="p-6">
                      <div className="flex items-center mb-3">
                        <span className="inline-block px-3 py-1 text-xs font-medium text-orange-600 bg-orange-100 rounded-full">
                          정기간행물
                        </span>
                        <time className="text-sm text-gray-500 ml-auto">
                          {formatDate(item.publishedAt || item.createdAt)}
                        </time>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 hover:text-orange-600 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-3">{item.summary}</p>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>{item.author}</span>
                        <span>조회수 {item.views.toLocaleString()}</span>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">등록된 정기간행물이 없습니다.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}