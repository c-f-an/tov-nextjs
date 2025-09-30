import Link from "next/link";
import { Breadcrumb } from "@/presentation/components/common/Breadcrumb";
import PageHeader from "@/presentation/components/common/PageHeader";

export default function SitemapPage() {
  const sitemapData = [
    {
      title: "About Us",
      links: [
        { name: "About Us", href: "/about" },
        { name: "우리는", href: "/about/greeting" },
        { name: "함께하는이들", href: "/about/organization" },
        { name: "사업보고", href: "/about/business" },
        { name: "오시는길", href: "/about/location" },
        { name: "FAQ", href: "/about/faq" },
      ],
    },
    {
      title: "토브운동",
      links: [
        { name: "토브운동", href: "/movement" },
        { name: "건강한 재정관리", href: "/movement/financial-management" },
        { name: "건강한 재정교육", href: "/movement/financial-education" },
        { name: "결산서 공개 운동", href: "/movement/financial-disclosure" },
        { name: "종교인 소득신고", href: "/movement/religious-income-report" },
        { name: "연대협력", href: "/movement/cooperation" },
      ],
    },
    {
      title: "토브 소식",
      links: [
        { name: "토브 소식", href: "/news" },
        { name: "공지사항", href: "/news/notice" },
        { name: "활동소식", href: "/news/activity" },
        { name: "언론보도", href: "/news/media" },
        { name: "정기간행물", href: "/news/publication" },
        { name: "관계법령", href: "/news/laws" },
      ],
    },
    {
      title: "자료실",
      links: [
        { name: "자료실", href: "/resources" },
        { name: "종교인소득", href: "/resources/religious-income" },
        { name: "비영리재정", href: "/resources/nonprofit-finance" },
        { name: "결산공시", href: "/resources/settlement" },
      ],
    },
    {
      title: "상담센터",
      links: [
        { name: "상담센터", href: "/consultation" },
        { name: "상담신청", href: "/consultation/apply" },
        { name: "상담안내", href: "/consultation/guide" },
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
      <Breadcrumb items={[{ label: "사이트맵" }]} />

      <div className="mx-auto">
        <PageHeader
          title="사이트맵"
          description="토브협회 웹사이트의 전체 구조를 확인하세요."
        />

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
                <strong>이사장:</strong> 최호윤
              </p>
            </div>
            <div>
              <p className="mb-2">
                <strong>주소:</strong> 서울 종로구 삼일대로 428, 500-42호
              </p>
              <p className="mb-2">
                <strong>TEL:</strong> 02-6951-1391
              </p>
              <p className="mb-2">
                <strong>FAX:</strong> 0505-231-2481
              </p>
              <p className="mb-2">
                <strong>E-MAIL:</strong> tov.npo@gmail.com
              </p>
              <p className="mb-2">
                <strong>후원계좌:</strong> KB국민 004401-04-191563 (사) 토브협회
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
