'use client';

import Link from 'next/link';
import { Post } from '@/core/domain/entities/Post';
import { FileText, Calendar, Newspaper } from 'lucide-react';

interface LatestNewsProps {
  notices: Post[];
  news: Post[];
  latestNews: any[];
}

// Default data for when DB has no posts
const defaultNewsItems = [
  {
    id: 1,
    title: '2024년 종교인 소득세 신고 안내',
    date: '2024-01-15',
    category: 'notice',
    categoryName: '공지사항',
    excerpt: '2024년 종교인 소득세 신고 기간과 절차에 대해 안내드립니다.',
    icon: FileText
  },
  {
    id: 2,
    title: '비영리단체 투명성 강화 세미나 성황리 개최',
    date: '2024-01-12',
    category: 'activity',
    categoryName: '활동소식',
    excerpt: '비영리단체의 재정 투명성 강화를 위한 실무자 세미나가 성공적으로 개최되었습니다.',
    icon: Calendar
  },
  {
    id: 3,
    title: '토브협회, KBS 뉴스에 소개',
    date: '2024-01-10',
    category: 'media',
    categoryName: '언론보도',
    excerpt: '토브협회의 비영리단체 지원 활동이 KBS 뉴스에 소개되었습니다.',
    icon: Newspaper
  }
];

function getCategoryName(category: string): string {
  const categoryMap: Record<string, string> = {
    'notice': '공지사항',
    'activity': '활동소식',
    'media': '언론보도',
    'publication': '발간자료',
    'laws': '법령정보'
  };
  return categoryMap[category] || '소식';
}

function getCategoryIcon(category: string) {
  const iconMap: Record<string, any> = {
    'notice': FileText,
    'activity': Calendar,
    'media': Newspaper,
    'publication': FileText,
    'laws': FileText
  };
  return iconMap[category] || Newspaper;
}

export function LatestNews({ notices, news, latestNews }: LatestNewsProps) {
  console.log("CLIENT latestNews received:", latestNews);
  console.log("CLIENT latestNews type:", typeof latestNews);
  console.log("CLIENT latestNews is array:", Array.isArray(latestNews));

  // Always use latestNews if provided
  const displayItems = (latestNews && latestNews.length > 0)
    ? latestNews.map((item) => ({
        id: item.id,
        title: item.title,
        date: item.publishedAt ? new Date(item.publishedAt).toLocaleDateString('ko-KR') : new Date(item.createdAt).toLocaleDateString('ko-KR'),
        category: item.category,
        categoryName: getCategoryName(item.category),
        excerpt: item.summary || '',
        icon: getCategoryIcon(item.category)
      }))
    : defaultNewsItems;

  console.log("CLIENT displayItems:", displayItems);

  return (
    <div className="bg-white rounded-lg shadow-sm p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">토브소식</h2>
        <Link href="/news" className="text-sm text-blue-600 hover:underline">
          전체보기 →
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {displayItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.id}
              href={`/news/${item.category}/${item.id}`}
              className="group"
            >
              <div className="bg-gray-50 rounded-lg p-6 h-full hover:shadow-md transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-blue-100 rounded-lg text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="ml-3 text-sm font-medium text-blue-600">
                    {item.categoryName}
                  </span>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                  {item.title}
                </h3>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {item.excerpt}
                </p>
                
                <div className="text-sm text-gray-500">
                  {item.date}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}