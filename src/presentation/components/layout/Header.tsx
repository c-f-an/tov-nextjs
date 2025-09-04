"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/presentation/contexts/AuthContext";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  const menuItems = [
    {
      title: "About Us",
      href: "/about",
      submenu: [
        { title: "우리는", href: "/about/greeting" },
        { title: "설립목적", href: "/about/purpose" },
        { title: "주요사업", href: "/about/business" },
        { title: "조직도", href: "/about/organization" },
        { title: "오시는길", href: "/about/location" },
        { title: "FAQ", href: "/about/faq" },
      ],
    },
    {
      title: "알림마당",
      href: "/board",
      submenu: [
        { title: "공지사항", href: "/board/notice" },
        { title: "토브소식", href: "/board/news" },
        { title: "언론보도", href: "/board/media" },
        { title: "발간자료", href: "/board/publication" },
        { title: "자료실", href: "/board/resource" },
        { title: "활동소식", href: "/board/activity" },
      ],
    },
    {
      title: "자료실",
      href: "/resources",
      submenu: [
        { title: "종교인소득", href: "/resources/religious-income" },
        { title: "비영리재정", href: "/resources/nonprofit-finance" },
        { title: "결산공시", href: "/resources/settlement" },
        { title: "관계법령", href: "/resources/laws" },
      ],
    },
    {
      title: "상담센터",
      href: "/consultation",
      submenu: [
        { title: "상담신청", href: "/consultation/apply" },
        { title: "상담안내", href: "/consultation/guide" },
      ],
    },
    {
      title: "후원하기",
      href: "/donation",
      submenu: [
        { title: "후원안내", href: "/donation/guide" },
        { title: "후원신청", href: "/donation/apply" },
        { title: "재정보고", href: "/donation/report" },
      ],
    },
  ];

  return (
    <header className="bg-white shadow-sm">
      {/* Top Bar */}
      <div className="bg-gray-50 border-b">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-10 text-sm">
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">비영리 재정 투명성의 시작</span>
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <span className="text-gray-700">{user.name}님</span>
                  <Link
                    href="/mypage"
                    className="text-gray-600 hover:text-gray-800"
                  >
                    마이페이지
                  </Link>
                  <button
                    onClick={logout}
                    className="text-gray-600 hover:text-gray-800"
                  >
                    로그아웃
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-gray-600 hover:text-gray-800"
                  >
                    로그인
                  </Link>
                  <Link
                    href="/register"
                    className="text-gray-600 hover:text-gray-800"
                  >
                    회원가입
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <h1 className="text-2xl font-bold text-blue-600">토브(TOV)</h1>
            <span className="ml-2 text-sm text-gray-600">
              사단법인 토브협회
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {menuItems.map((item) => (
              <div key={item.href} className="relative group">
                <Link
                  href={item.href}
                  className="text-gray-700 hover:text-blue-600 font-medium py-6 block"
                >
                  {item.title}
                </Link>
                {item.submenu && (
                  <div className="absolute left-0 top-full w-48 bg-white shadow-lg rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="py-2">
                      {item.submenu.map((subItem) => (
                        <Link
                          key={subItem.href}
                          href={subItem.href}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                        >
                          {subItem.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 rounded-md hover:bg-gray-100"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t">
          <div className="container mx-auto px-4 py-4">
            {menuItems.map((item) => (
              <div key={item.href} className="mb-4">
                <Link
                  href={item.href}
                  className="block font-medium text-gray-700 hover:text-blue-600 mb-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.title}
                </Link>
                {item.submenu && (
                  <div className="ml-4 space-y-2">
                    {item.submenu.map((subItem) => (
                      <Link
                        key={subItem.href}
                        href={subItem.href}
                        className="block text-sm text-gray-600 hover:text-blue-600"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {subItem.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
