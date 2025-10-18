"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useAuth } from "@/presentation/contexts/AuthContext";

interface Category {
  id: number;
  name: string;
  slug: string;
  type: string;
}

interface MenuItem {
  title: string;
  href: string;
  submenu?: { title: string; href: string }[];
}

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const { user, logout } = useAuth();

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      // 게시판 카테고리 가져오기
      const postsResponse = await fetch('/api/categories');
      const postsCategories: Category[] = await postsResponse.json();

      // 자료실 카테고리 가져오기 (활성화된 것만)
      const resourcesResponse = await fetch('/api/resources/categories?active=true');
      const resourceCategories = await resourcesResponse.json();

      // 카테고리를 타입별로 그룹화
      const filteredPostsCategories = postsCategories.filter(cat =>
        ['notice', 'news', 'activity', 'media', 'publication', 'laws'].includes(cat.type)
      );

      // 정적 메뉴 아이템 구성
      const staticMenuItems: MenuItem[] = [
        {
          title: "About Us",
          href: "/about",
          submenu: [
            { title: "우리는", href: "/about/greeting" },
            { title: "함께하는이들", href: "/about/organization" },
            { title: "사업보고", href: "/about/business" },
            { title: "오시는길", href: "/about/location" },
            { title: "FAQ", href: "/about/faq" },
          ],
        },
        {
          title: "토브운동",
          href: "/movement",
          submenu: [
            { title: "건강한 재정관리", href: "/movement/financial-management" },
            { title: "건강한 재정교육", href: "/movement/financial-education" },
            { title: "결산서 공개 운동", href: "/movement/financial-disclosure" },
            { title: "종교인 소득신고", href: "/movement/religious-income-report" },
            { title: "연대협력", href: "/movement/cooperation" },
          ],
        },
        {
          title: "토브 소식",
          href: "/posts",
          submenu: filteredPostsCategories.map(cat => ({
            title: cat.name,
            href: `/posts/${cat.slug}`
          }))
        },
        {
          title: "자료실",
          href: "/resources",
          submenu: resourceCategories.map((cat: any) => ({
            title: cat.name,
            href: `/resources/${cat.slug}`
          }))
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

      setMenuItems(staticMenuItems);
    } catch (error) {
      console.error('Failed to fetch categories:', error);

      // 에러 시 기본 메뉴 사용
      const fallbackMenuItems: MenuItem[] = [
        {
          title: "About Us",
          href: "/about",
          submenu: [
            { title: "우리는", href: "/about/greeting" },
            { title: "함께하는이들", href: "/about/organization" },
            { title: "사업보고", href: "/about/business" },
            { title: "오시는길", href: "/about/location" },
            { title: "FAQ", href: "/about/faq" },
          ],
        },
        {
          title: "토브운동",
          href: "/movement",
          submenu: [
            { title: "건강한 재정관리", href: "/movement/financial-management" },
            { title: "건강한 재정교육", href: "/movement/financial-education" },
            { title: "결산서 공개 운동", href: "/movement/financial-disclosure" },
            { title: "종교인 소득신고", href: "/movement/religious-income-report" },
            { title: "연대협력", href: "/movement/cooperation" },
          ],
        },
        {
          title: "토브 소식",
          href: "/posts",
          submenu: [
            { title: "공지사항", href: "/posts/notice" },
            { title: "활동소식", href: "/posts/activity" },
            { title: "언론보도", href: "/posts/media" },
            { title: "정기간행물", href: "/posts/publication" },
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

      setMenuItems(fallbackMenuItems);
    }
  };

  const toggleSubmenu = (href: string) => {
    setExpandedMenus((prev) =>
      prev.includes(href)
        ? prev.filter((item) => item !== href)
        : [...prev, href]
    );
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
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
                  {user.role === 'ADMIN' && (
                    <Link
                      href="/admin"
                      className="text-gray-600 hover:text-gray-800"
                    >
                      어드민
                    </Link>
                  )}
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
            <Image
              src="/tov_logo.png"
              alt="토브(TOV) 사단법인 토브협회"
              width={400}
              height={30}
              className="h-20 w-auto"
              priority
            />
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
                {item.submenu && item.submenu.length > 0 && (
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
                <div className="flex items-center justify-between">
                  <Link
                    href={item.href}
                    className="block font-medium text-gray-700 hover:text-blue-600 mb-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.title}
                  </Link>
                  {item.submenu && item.submenu.length > 0 && (
                    <button
                      onClick={() => toggleSubmenu(item.href)}
                      className="p-2 hover:bg-gray-100 rounded"
                    >
                      <svg
                        className={`w-4 h-4 transition-transform ${
                          expandedMenus.includes(item.href) ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                  )}
                </div>
                {item.submenu && expandedMenus.includes(item.href) && (
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