import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-gray-50 text-gray-800 mt-auto border-t border-gray-200">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Organization Info */}
          <div>
            <h3 className="text-lg font-bold mb-4">사단법인 토브협회</h3>
            <p className="text-sm text-gray-600 mb-2">
              비영리 재정 투명성을 위한 전문 기관
            </p>
            <p className="text-sm text-gray-600">
              종교인 소득세 및 비영리 회계 전문 상담
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-md font-semibold mb-4">바로가기</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/about"
                  className="text-gray-600 hover:text-gray-900"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/board/notice"
                  className="text-gray-600 hover:text-gray-900"
                >
                  공지사항
                </Link>
              </li>
              <li>
                <Link
                  href="/consultation/apply"
                  className="text-gray-600 hover:text-gray-900"
                >
                  상담신청
                </Link>
              </li>
              <li>
                <Link
                  href="/donation/apply"
                  className="text-gray-600 hover:text-gray-900"
                >
                  후원하기
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-md font-semibold mb-4">연락처</h4>
            <address className="text-sm text-gray-600 not-italic space-y-2">
              <p>서울 종로구 삼일대로 428, 500-42호</p>
              <p>TEL: 02-6951-1391</p>
              <p>FAX: 0505-231-2481</p>
              <p>E-mail: tov.npo@gmail.com</p>
            </address>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-300 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-500">
              © 2025 사단법인 토브협회. All rights reserved.
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Link
                href="/privacy"
                className="text-sm text-gray-500 hover:text-gray-900"
              >
                개인정보처리방침
              </Link>
              <Link
                href="/terms"
                className="text-sm text-gray-500 hover:text-gray-900"
              >
                이용약관
              </Link>
              <Link
                href="/sitemap"
                className="text-sm text-gray-500 hover:text-gray-900"
              >
                사이트맵
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
