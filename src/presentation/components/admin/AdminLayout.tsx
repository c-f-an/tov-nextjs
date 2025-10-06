'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/presentation/contexts/AuthContext';

interface AdminMenuItem {
  title: string;
  href: string;
  icon: React.ReactNode;
  children?: AdminMenuItem[];
}

const menuItems: AdminMenuItem[] = [
  {
    title: '대시보드',
    href: '/admin',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    )
  },
  {
    title: '게시판 관리',
    href: '/admin/posts',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    children: [
      { title: '게시글 목록', href: '/admin/posts', icon: null },
      { title: '카테고리 관리', href: '/admin/categories', icon: null }
    ]
  },
  {
    title: '상담 관리',
    href: '/admin/consultations',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    )
  },
  {
    title: '후원 관리',
    href: '/admin/donations',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    children: [
      { title: '후원자 목록', href: '/admin/sponsors', icon: null },
      { title: '후원 내역', href: '/admin/donations', icon: null }
    ]
  },
  {
    title: '회원 관리',
    href: '/admin/users',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    )
  },
  {
    title: '사이트 설정',
    href: '/admin/settings',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    )
  }
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpanded = (href: string) => {
    setExpandedItems(prev =>
      prev.includes(href)
        ? prev.filter(item => item !== href)
        : [...prev, href]
    );
  };

  const isActive = (href: string) => {
    // 대시보드(/admin)는 정확히 일치하는 경우에만 활성화
    if (href === '/admin') {
      return pathname === '/admin';
    }
    // 다른 메뉴들은 prefix 매칭
    return pathname === href || pathname.startsWith(href + '/');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Bar */}
      <div className="bg-white shadow-sm border-b">
        <div className="flex items-center justify-between h-16 px-4">
          <div className="flex items-center">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-md hover:bg-gray-100"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <Link href="/admin" className="ml-4 text-xl font-bold text-gray-800">
              토브협회 관리자
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link
              href="/"
              target="_blank"
              className="text-sm text-gray-600 hover:text-gray-800"
            >
              사이트 보기
            </Link>
            <div className="relative group">
              <button className="flex items-center space-x-2 text-sm text-gray-700">
                <span>{user?.name || '관리자'}</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                <Link
                  href="/admin/profile"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  프로필 설정
                </Link>
                <button
                  onClick={logout}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  로그아웃
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`${
            isSidebarOpen ? 'w-64' : 'w-0'
          } bg-white border-r border-gray-200 min-h-screen transition-all duration-300 overflow-hidden`}
        >
          <nav className="mt-8 px-4">
            {menuItems.map((item) => (
              <div key={item.href} className="mb-2">
                <div className="relative">
                  <Link
                    href={item.href}
                    className={`flex items-center justify-between px-4 py-2 rounded-md transition-colors ${
                      isActive(item.href)
                        ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-700'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      {item.icon}
                      <span>{item.title}</span>
                    </div>
                    {item.children && (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          toggleExpanded(item.href);
                        }}
                        className="p-1"
                      >
                        <svg
                          className={`w-4 h-4 transition-transform ${
                            expandedItems.includes(item.href) ? 'rotate-90' : ''
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    )}
                  </Link>
                  
                  {item.children && expandedItems.includes(item.href) && (
                    <div className="mt-2 ml-4 space-y-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={`block px-4 py-2 text-sm rounded-md transition-colors ${
                            isActive(child.href)
                              ? 'bg-blue-50 text-blue-600'
                              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                          }`}
                        >
                          {child.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}