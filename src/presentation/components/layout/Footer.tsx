"use client";

import Link from "next/link";
import { useState } from "react";

export function Footer() {
  const [isFamilySiteOpen, setIsFamilySiteOpen] = useState(false);

  const snsLinks = [
    { name: "카카오톡", icon: "💬", url: "#" },
    { name: "페이스북", icon: "f", url: "#" },
    { name: "인스타그램", icon: "📷", url: "#" },
    { name: "네이버", icon: "N", url: "#" },
    { name: "유튜브", icon: "▶", url: "#" },
  ];

  const familySites = [
    { name: "한국세무사회", url: "#" },
    { name: "국세청", url: "https://www.nts.go.kr/" },
    { name: "기획재정부", url: "https://www.moef.go.kr/" },
  ];

  return (
    <footer className="mt-auto">
      {/* 상단 영역 - 뉴스레터 섹션 */}
      <div className="bg-gray-100 py-6 border-t border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* 왼쪽: 텍스트 */}
            <div>
              <p className="text-lg font-medium text-gray-800">
                비영리 재정 투명성을 위한 전문 기관
              </p>
            </div>

            {/* 오른쪽: 버튼과 SNS */}
            <div className="flex items-center gap-6">
              {/* SNS 아이콘들 */}
              <div className="flex items-center gap-2">
                {snsLinks.map((sns) => (
                  <a
                    key={sns.name}
                    href={sns.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-white border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors"
                    aria-label={sns.name}
                  >
                    <span className="text-sm font-bold">{sns.icon}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 하단 영역 - 메인 푸터 */}
      <div className="bg-white py-10 border-t border-gray-200">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 왼쪽 섹션 */}
            <div className="lg:col-span-2">
              {/* 네비게이션 링크들 */}
              <nav className="mb-6">
                <ul className="flex flex-wrap items-center gap-2 text-sm">
                  <li>
                    <Link
                      href="/sitemap"
                      className="text-gray-600 hover:text-gray-900"
                    >
                      사이트맵
                    </Link>
                  </li>
                  <li className="text-gray-400">|</li>
                  <li>
                    <Link
                      href="/terms"
                      className="text-gray-600 hover:text-gray-900"
                    >
                      이용약관
                    </Link>
                  </li>
                  <li className="text-gray-400">|</li>
                  <li>
                    <Link
                      href="/privacy"
                      className="text-gray-600 hover:text-gray-900 font-semibold"
                    >
                      개인정보처리방침
                    </Link>
                  </li>
                </ul>
              </nav>

              {/* 회사 정보 */}
              <div className="mb-6 space-y-1">
                <p className="text-xs text-gray-500">
                  사단법인 토브협회 | 대표자: 최호윤 | 사업자등록번호:
                  123-45-67890
                </p>
                <p className="text-xs text-gray-500">
                  주소: 서울특별시 종로구 삼일대로 428, 500-42호
                </p>
                <p className="text-xs text-gray-500">
                  이메일: tov.npo@gmail.com | 팩스: 0505-231-2481
                </p>
              </div>

              {/* COPYRIGHT */}
              <p className="text-xs text-gray-500">
                COPYRIGHT © 2025 사단법인 토브협회. ALL RIGHTS RESERVED.
              </p>
            </div>

            {/* 오른쪽 섹션 */}
            <div className="lg:text-right space-y-4">
              {/* 대표전화 */}
              <div>
                <p className="text-3xl font-bold text-gray-900 mb-1">
                  02-6951-1391
                </p>
                <p className="text-sm text-gray-600">
                  상담시간: 평일 09:00 - 18:00 (점심시간 12:00 - 13:00)
                </p>
              </div>

              {/* Family Site 드롭다운 */}
              <div className="relative inline-block text-left">
                <button
                  onClick={() => setIsFamilySiteOpen(!isFamilySiteOpen)}
                  className="inline-flex items-center justify-between w-48 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Family Site
                  <svg
                    className="w-5 h-5 ml-2 -mr-1"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>

                {isFamilySiteOpen && (
                  <div className="absolute right-0 w-48 mt-2 origin-top-right bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
                    <div className="py-1">
                      {familySites.map((site) => (
                        <a
                          key={site.name}
                          href={site.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          {site.name}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
