"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import SearchBar from "@/presentation/components/news/SearchBar";
import { fetchNewsList } from "@/lib/api/news";
import { News } from "@/core/domain/entities/News";

function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export default function LawsPage() {
  const [newsItems, setNewsItems] = useState<News[]>([]);
  const [filteredItems, setFilteredItems] = useState<News[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadNews() {
      setLoading(true);
      try {
        const result = await fetchNewsList({
          category: 'laws',
          limit: 20
        });
        setNewsItems(result.items);
        setFilteredItems(result.items);
      } catch (error) {
        console.error('Failed to fetch news:', error);
      } finally {
        setLoading(false);
      }
    }
    loadNews();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = newsItems.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.summary?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredItems(filtered);
    } else {
      setFilteredItems(newsItems);
    }
  }, [searchQuery, newsItems]);

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-indigo-600 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">관계법령</h1>
          <p className="text-xl mb-8">비영리단체 운영에 필요한 법령 정보를 제공합니다</p>
          
          <SearchBar
            onSearch={setSearchQuery}
            placeholder="관계법령을 검색하세요..."
          />
        </div>
      </section>
      
      <section className="py-12">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]">
                <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
              </div>
            </div>
          ) : filteredItems.length > 0 ? (
            <>
              {searchQuery && (
                <div className="mb-6">
                  <p className="text-gray-600">
                    "{searchQuery}"에 대한 검색 결과 {filteredItems.length}건
                  </p>
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.map((item) => (
                  <Link key={item.id} href={`/news/laws/${item.id}`} className="block">
                    <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 h-full">
                      <div className="p-6">
                        <div className="flex items-center mb-3">
                          <span className="inline-block px-3 py-1 text-xs font-medium text-indigo-600 bg-indigo-100 rounded-full">
                            관계법령
                          </span>
                          <time className="text-sm text-gray-500 ml-auto">
                            {formatDate(item.publishedAt || item.createdAt)}
                          </time>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 hover:text-indigo-600 transition-colors">
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
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">
                {searchQuery ? `"${searchQuery}"에 대한 검색 결과가 없습니다.` : '등록된 관계법령이 없습니다.'}
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}