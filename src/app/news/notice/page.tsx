"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import SearchBar from "@/presentation/components/news/SearchBar";
import PageHeader from "@/presentation/components/common/PageHeader";
import { fetchNewsList } from "@/lib/api/news";
import { News } from "@/core/domain/entities/News";

// 날짜 포맷 함수
function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export default function NoticePage() {
  const [newsItems, setNewsItems] = useState<News[]>([]);
  const [filteredItems, setFilteredItems] = useState<News[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // API에서 데이터 가져오기
  useEffect(() => {
    async function loadNews() {
      setLoading(true);
      try {
        const result = await fetchNewsList({
          category: 'notice',
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

  // 검색 필터 적용
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
      <div className="container mx-auto px-4 py-8">
        <PageHeader 
          title="공지사항"
          description="토브협회의 주요 공지사항을 확인하세요"
        />
        
        {/* 검색창 */}
        <div className="max-w-2xl mx-auto mb-8">
          <SearchBar
            onSearch={setSearchQuery}
            placeholder="공지사항을 검색하세요..."
          />
        </div>
      </div>
      
      <section>
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
                  <Link key={item.id} href={`/news/notice/${item.id}`} className="block">
                    <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 h-full">
                      <div className="p-6">
                        <div className="flex items-center mb-3">
                          <span className="inline-block px-3 py-1 text-xs font-medium text-blue-600 bg-blue-100 rounded-full">
                            공지사항
                          </span>
                          <time className="text-sm text-gray-500 ml-auto">
                            {formatDate(item.publishedAt || item.createdAt)}
                          </time>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
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
                {searchQuery ? `"${searchQuery}"에 대한 검색 결과가 없습니다.` : '등록된 공지사항이 없습니다.'}
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}