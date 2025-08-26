'use client';

import Link from 'next/link';
import { useState } from 'react';

// Mock data - 실제로는 API에서 가져올 데이터
const mockNotices = [
  {
    id: 1,
    title: '2024년 종교인 소득세 신고 안내',
    date: '2024-01-15',
    category: 'notice'
  },
  {
    id: 2,
    title: '비영리법인 결산서류 공시 의무화 안내',
    date: '2024-01-10',
    category: 'notice'
  },
  {
    id: 3,
    title: '1분기 실무자 교육 프로그램 신청 안내',
    date: '2024-01-05',
    category: 'notice'
  },
  {
    id: 4,
    title: '토브협회 신년 인사',
    date: '2024-01-02',
    category: 'notice'
  }
];

const mockNews = [
  {
    id: 1,
    title: '비영리단체 투명성 강화 세미나 성황리 개최',
    date: '2024-01-12',
    category: 'news'
  },
  {
    id: 2,
    title: '종교인 소득세 관련 법령 개정 동향',
    date: '2024-01-08',
    category: 'news'
  },
  {
    id: 3,
    title: '2023년 재정 투명성 우수 단체 선정',
    date: '2024-01-03',
    category: 'news'
  },
  {
    id: 4,
    title: '비영리 회계 실무 가이드북 발간',
    date: '2023-12-28',
    category: 'news'
  }
];

export function LatestNews() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* 공지사항 */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold">공지사항</h3>
          <Link href="/board/notice" className="text-sm text-blue-600 hover:underline">
            더보기 →
          </Link>
        </div>
        <ul className="space-y-3">
          {mockNotices.map((item) => (
            <li key={item.id} className="border-b pb-3 last:border-0">
              <Link href={`/board/notice/${item.id}`} className="block hover:bg-gray-50 -mx-2 px-2 py-1 rounded">
                <div className="flex justify-between items-start">
                  <h4 className="text-gray-800 hover:text-blue-600 flex-1 line-clamp-1">
                    {item.title}
                  </h4>
                  <span className="text-sm text-gray-500 ml-4 whitespace-nowrap">
                    {item.date}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* 토브소식 */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold">토브소식</h3>
          <Link href="/board/news" className="text-sm text-blue-600 hover:underline">
            더보기 →
          </Link>
        </div>
        <ul className="space-y-3">
          {mockNews.map((item) => (
            <li key={item.id} className="border-b pb-3 last:border-0">
              <Link href={`/board/news/${item.id}`} className="block hover:bg-gray-50 -mx-2 px-2 py-1 rounded">
                <div className="flex justify-between items-start">
                  <h4 className="text-gray-800 hover:text-blue-600 flex-1 line-clamp-1">
                    {item.title}
                  </h4>
                  <span className="text-sm text-gray-500 ml-4 whitespace-nowrap">
                    {item.date}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}