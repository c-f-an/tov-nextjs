"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronRight, FileText, Calendar, Newspaper, Book, Gavel } from "lucide-react";
import SearchBar from "@/presentation/components/news/SearchBar";
import CategoryFilter, { NewsCategory } from "@/presentation/components/news/CategoryFilter";
import { fetchNewsList } from "@/lib/api/news";
import { News } from "@/core/domain/entities/News";


export default function NewsPage() {
  const [recentNews, setRecentNews] = useState<News[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<NewsCategory>('all');
  const [loading, setLoading] = useState(false);
  const [filteredNews, setFilteredNews] = useState<News[]>([]);

  const newsCategories = [
    {
      title: "공지사항",
      href: "/news/notice",
      icon: FileText,
      description: "토브협회의 중요한 공지사항을 확인하세요",
      color: "bg-blue-500",
    },
    {
      title: "활동소식",
      href: "/news/activity",
      icon: Calendar,
      description: "토브협회의 다양한 활동 소식을 만나보세요",
      color: "bg-green-500",
    },
    {
      title: "언론보도",
      href: "/news/media",
      icon: Newspaper,
      description: "언론에 보도된 토브협회 관련 뉴스입니다",
      color: "bg-purple-500",
    },
    {
      title: "정기간행물",
      href: "/news/publication",
      icon: Book,
      description: "토브협회에서 발행하는 정기 간행물입니다",
      color: "bg-orange-500",
    },
    {
      title: "관계법령",
      href: "/news/laws",
      icon: Gavel,
      description: "비영리단체 관련 법령 정보를 제공합니다",
      color: "bg-red-500",
    },
  ];

  // API에서 뉴스 가져오기
  useEffect(() => {
    async function loadNews() {
      setLoading(true);
      try {
        const response = await fetchNewsList({ limit: 10 });
        setRecentNews(response.items);
        setFilteredNews(response.items);
      } catch (error) {
        console.error('Error loading news:', error);
      } finally {
        setLoading(false);
      }
    }
    loadNews();
  }, []);

  // 검색과 필터 적용
  useEffect(() => {
    let filtered = recentNews;

    // 카테고리 필터
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(news => news.category === selectedCategory);
    }

    // 검색어 필터
    if (searchQuery) {
      filtered = filtered.filter(news => 
        news.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        news.summary?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredNews(filtered);
  }, [searchQuery, selectedCategory, recentNews]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">토브 소식</h1>
          <p className="text-xl mb-8">토브협회의 다양한 소식과 정보를 전해드립니다</p>
          
          {/* Search Bar */}
          <SearchBar 
            onSearch={setSearchQuery}
            placeholder="토브 소식을 검색하세요..."
          />
          
          {/* Category Filter */}
          <div className="mt-6">
            <CategoryFilter 
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {newsCategories.map((category) => {
            const Icon = category.icon;
            return (
              <Link key={category.href} href={category.href}>
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className={`p-3 rounded-lg text-white ${category.color}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                    <CardTitle className="mt-4">{category.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{category.description}</p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent News Section */}
      <div className="bg-white py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8">
            {searchQuery || selectedCategory !== 'all' ? '검색 결과' : '최신 소식'}
          </h2>
          
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]">
                <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
              </div>
            </div>
          ) : filteredNews.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              검색 결과가 없습니다.
            </div>
          ) : (
            <div className="space-y-4">
              {filteredNews.map((news) => {
                const categoryNameMap = {
                  'notice': '공지사항',
                  'activity': '활동소식',
                  'media': '언론보도',
                  'publication': '정기간행물',
                  'laws': '관계법령'
                };
                return (
                  <Link 
                    key={news.id} 
                    href={`/news/${news.category}/${news.id}`}
                  >
                    <div className="border-b pb-4 hover:bg-gray-50 p-4 rounded-lg transition-colors">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-sm text-blue-600 font-medium">
                            {categoryNameMap[news.category as keyof typeof categoryNameMap]}
                          </span>
                          <h3 className="text-lg font-medium mt-1 hover:text-blue-600 transition-colors">
                            {news.title}
                          </h3>
                          {news.summary && (
                            <p className="text-sm text-gray-600 mt-2">{news.summary}</p>
                          )}
                        </div>
                        <span className="text-sm text-gray-500">
                          {new Date(news.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
          
          <div className="text-center mt-8">
            <Link href="/news/notice">
              <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                더 많은 소식 보기
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}