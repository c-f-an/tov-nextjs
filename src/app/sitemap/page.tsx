import Link from "next/link";
import { Breadcrumb } from "@/presentation/components/common/Breadcrumb";

export default function SitemapPage() {
  const sitemapData = [
    {
      title: "About Us",
      links: [
        { name: "About Us", href: "/about" },
        { name: "인사말", href: "/about/greeting" },
        { name: "우리는", href: "/about/purpose" },
        { name: "사업보고", href: "/about/business" },
        { name: "함께하는 이들", href: "/about/organization" },
        { name: "찾아오시는 길", href: "/about/location" },
      ],
    },
    {
      title: "알림마당",
      links: [
        { name: "알림마당", href: "/board" },
        { name: "공지사항", href: "/board/notice" },
        { name: "토브소식", href: "/board/news" },
        { name: "언론보도", href: "/board/media" },
        { name: "발간자료", href: "/board/publication" },
        { name: "자료실", href: "/board/resource" },
        { name: "활동소식", href: "/board/activity" },
      ],
    },
    {
      title: "자료실",
      links: [
        { name: "자료실", href: "/resources" },
        { name: "종교인소득", href: "/resources/religious-income" },
        { name: "비영리재정", href: "/resources/nonprofit-finance" },
        { name: "결산공시", href: "/resources/settlement" },
        { name: "관계법령", href: "/resources/laws" },
      ],
    },
    {
      title: "상담센터",
      links: [
        { name: "상담센터", href: "/consultation" },
        { name: "상담신청", href: "/consultation/apply" },
        { name: "상담안내", href: "/consultation/guide" },
        { name: "상담목록", href: "/consultation/list" },
        { name: "FAQ", href: "/consultation/faq" },
      ],
    },
    {
      title: "후원하기",
      links: [
        { name: "후원하기", href: "/donation" },
        { name: "후원안내", href: "/donation/guide" },
        { name: "후원신청", href: "/donation/apply" },
        { name: "재정보고", href: "/donation/report" },
      ],
    },
    {
      title: "회원서비스",
      links: [
        { name: "로그인", href: "/login" },
        { name: "회원가입", href: "/register" },
        { name: "마이페이지", href: "/mypage" },
      ],
    },
    {
      title: "정책",
      links: [
        { name: "개인정보처리방침", href: "/privacy" },
        { name: "이용약관", href: "/terms" },
      ],
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb items={[{ label: '사이트맵' }]} />
      
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">사이트맵</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sitemapData.map((section, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4 text-blue-600 border-b pb-2">
                {section.title}
              </h2>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link
                      href={link.href}
                      className="text-gray-600 hover:text-blue-600 hover:underline transition-colors duration-200 flex items-center"
                    >
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-gray-50 rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">사이트 정보</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
              <p className="mb-2">
                <strong>운영기관:</strong> 사단법인 토브협회
              </p>
              <p className="mb-2">
                <strong>대표자:</strong> 홍길동
              </p>
              <p className="mb-2">
                <strong>사업자등록번호:</strong> 123-45-67890
              </p>
            </div>
            <div>
              <p className="mb-2">
                <strong>주소:</strong> 서울특별시 강남구 ○○로 123
              </p>
              <p className="mb-2">
                <strong>전화:</strong> 02-1234-5678
              </p>
              <p className="mb-2">
                <strong>이메일:</strong> info@tov.or.kr
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
