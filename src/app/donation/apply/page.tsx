'use client';

import { useAuth } from '@/presentation/contexts/AuthContext';
import { Breadcrumb } from "@/presentation/components/common/Breadcrumb";
import PageHeader from '@/presentation/components/common/PageHeader';
import Image from 'next/image';
import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';

const NOTICE_ITEMS = [
  '후원등록 링크는 로그인해야 접근이 가능합니다.',
  '일회성 결제를 원하시면 기간을 1달로 등록해주세요.',
  '후원 신청 후 처리까지 1~2일이 소요될 수 있습니다.',
  '후원 관련 문의사항은 사무국으로 연락해 주세요.',
];

const QR_IMAGE_URL =
  'https://tov-homepage-resource-production.s3.ap-northeast-2.amazonaws.com/assets/cms-qrcode_20260225.png';
const DONATION_LINK =
  'https://ap.hyosungcmsplus.co.kr/external/shorten/20260211jUtKW0aPcW';

export default function DonationApplyPage() {
  const { user } = useAuth();

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <PageHeader
          title={<></>}
          description=""
          backgroundImage="/menu-header/header-bg-donation-apply.webp"
          overlayColor="#00357f"
          overlayOpacity={0}
        >
          <Breadcrumb
            items={[{ label: "후원하기" }, { label: "후원신청" }]}
            variant="light"
          />
        </PageHeader>

        <div className="max-w-2xl mx-auto mt-10 space-y-8 pb-16">
          {/* Notice Section */}
          <div className="rounded-xl border-2 border-amber-400 bg-amber-50 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-5">
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-amber-400">
                <AlertTriangle className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-amber-900">
                후원하기 전 꼭 읽어주세요.
              </h2>
            </div>
            <ul className="space-y-3 pl-1">
              {NOTICE_ITEMS.map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-amber-900">
                  <span className="mt-2 mr-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber-500" />
                  <span className="text-sm leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* QR + Link Section */}
          {user ? (
            <div className="rounded-xl bg-white shadow-sm p-8 flex flex-col items-center gap-6">
              <h2 className="text-lg font-semibold text-gray-800">후원 신청</h2>
              <Image
                src={QR_IMAGE_URL}
                alt="후원 QR코드"
                width={220}
                height={220}
                className="rounded-lg border border-gray-200"
                unoptimized
              />
              <p className="text-sm text-gray-500 text-center">
                QR코드를 스캔하거나 아래 버튼을 눌러 후원 신청 페이지로 이동하세요.
              </p>
              <a
                href={DONATION_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block rounded-lg bg-primary w-fit px-2 py-3 text-center text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              >
                후원 신청 바로가기
              </a>
            </div>
          ) : (
            <div className="rounded-xl bg-white shadow-sm p-10 flex flex-col items-center gap-5">
              <p className="text-gray-600 text-center text-sm leading-relaxed">
                후원 신청 링크 및 QR코드는 <strong>로그인 후</strong> 확인하실 수 있습니다.
              </p>
              <Link
                href="/login"
                className="inline-block rounded-lg bg-primary px-2 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              >
                로그인하기
              </Link>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
