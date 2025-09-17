"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronRight, FileText, Calendar, Newspaper, Book, Gavel } from "lucide-react";

interface NewsItem {
  id: number;
  title: string;
  date: string;
  category: string;
}

export default function NewsPage() {
  const [recentNews, setRecentNews] = useState<NewsItem[]>([]);

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

  useEffect(() => {
    // TODO: API에서 최신 뉴스 가져오기
    setRecentNews([
      { id: 1, title: "2024년 토브협회 정기총회 안내", date: "2024-03-15", category: "공지사항" },
      { id: 2, title: "비영리단체 회계 세미나 개최", date: "2024-03-12", category: "활동소식" },
      { id: 3, title: "토브협회, 투명성 대상 수상", date: "2024-03-10", category: "언론보도" },
    ]);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">토브 소식</h1>
          <p className="text-xl">토브협회의 다양한 소식과 정보를 전해드립니다</p>
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
          <h2 className="text-2xl font-bold mb-8">최신 소식</h2>
          <div className="space-y-4">
            {recentNews.map((news) => (
              <Link 
                key={news.id} 
                href={`/news/${news.category === "공지사항" ? "notice" : 
                  news.category === "활동소식" ? "activity" : 
                  news.category === "언론보도" ? "media" : "notice"}/${news.id}`}
              >
                <div className="border-b pb-4 hover:bg-gray-50 p-4 rounded-lg transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-sm text-blue-600 font-medium">{news.category}</span>
                      <h3 className="text-lg font-medium mt-1 hover:text-blue-600 transition-colors">
                        {news.title}
                      </h3>
                    </div>
                    <span className="text-sm text-gray-500">{news.date}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          
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